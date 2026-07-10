package backend.controladores;

import java.io.IOException;

import backend.DAO.PagoDAO;
import backend.modelos.Pago;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/pago")
public class PagoServlet extends HttpServlet {

    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        response.setContentType("text/plain;charset=UTF-8");

        int idPedido =
            convertirEntero(request.getParameter("idPedido"));

        String metodo =
            request.getParameter("metodo");

        double monto =
            convertirDecimal(request.getParameter("monto"));

        if (idPedido <= 0 || metodo == null || metodo.isEmpty() || monto <= 0) {

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println(
                "Datos de pago invalidos"
            );

            return;
        }

        Pago pago =
            new Pago(idPedido, metodo, monto, "CONFIRMADO");

        PagoDAO dao =
            new PagoDAO();

        boolean guardado =
            dao.guardarPago(pago);

        if (guardado) {

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().println(
                "Pago registrado correctamente"
            );

        } else {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println(
                "Error al registrar el pago"
            );
        }
    }

    private int convertirEntero(String valor) {

        try {
            return Integer.parseInt(valor);
        } catch (Exception e) {
            return 0;
        }
    }

    private double convertirDecimal(String valor) {

        try {
            return Double.parseDouble(valor);
        } catch (Exception e) {
            return 0;
        }
    }
}