package backend.controladores;

import java.io.IOException;

import backend.DAO.ClienteDAO;
import backend.modelos.Cliente;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/pedido")
public class PedidoController extends HttpServlet {

    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        response.setContentType("text/plain;charset=UTF-8");

        String nombre =
            request.getParameter("nombre");

        String direccion =
            request.getParameter("direccion");

        String correo =
            request.getParameter("correo");

        String celular =
            request.getParameter("celular");

        Cliente cliente =
            new Cliente(
                nombre,
                direccion,
                correo,
                celular
            );

        ClienteDAO dao =
            new ClienteDAO();

        boolean guardado =
            dao.guardarCliente(cliente);

        if (guardado) {

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().println(
                "Cliente registrado correctamente"
            );

        } else {

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println(
                "Error al registrar cliente"
            );
        }
    }
}