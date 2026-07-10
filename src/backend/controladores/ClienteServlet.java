package backend.controladores;

import java.io.IOException;

import backend.DAO.ClienteDAO;
import backend.DAO.DetallePedidoDAO;
import backend.DAO.PedidoDAO;
import backend.DAO.PlatoDAO;
import backend.modelos.Cliente;
import backend.modelos.DetallePedido;
import backend.modelos.Pedido;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/cliente")
public class ClienteServlet extends HttpServlet {

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

        int idCliente =
            dao.guardarClienteYRetornarId(cliente);

        if (idCliente > 0) {

            String[] nombres =
                request.getParameterValues("platoNombre");

            int idPedido = 0;

            if (nombres != null && nombres.length > 0) {
                idPedido = guardarPedidoConDetalle(request, idCliente, nombres);
            }

            // El front (cliente.js) lee este header para saber a qué
            // pedido debe asociar el pago en pagos.html.
            response.setHeader("X-Id-Pedido", String.valueOf(idPedido));

            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().println(
                "Cliente y pedido registrados correctamente"
            );

        } else { 

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println(
                "Error al registrar cliente"
            );
        }
    }

    private int guardarPedidoConDetalle(
        HttpServletRequest request,
        int idCliente,
        String[] nombres
    ) {

        String[] categorias =
            request.getParameterValues("platoCategoria");

        String[] regiones =
            request.getParameterValues("platoRegion");

        String[] cantidades =
            request.getParameterValues("platoCantidad");

        String[] precios =
            request.getParameterValues("platoPrecio");

        PedidoDAO pedidoDAO =
            new PedidoDAO();

        int idPedido =
            pedidoDAO.guardarPedidoYRetornarId(new Pedido(idCliente));

        if (idPedido == 0) {
            return 0;
        }

        PlatoDAO platoDAO =
            new PlatoDAO();

        DetallePedidoDAO detalleDAO =
            new DetallePedidoDAO();

        for (int i = 0; i < nombres.length; i++) {
            String nombrePlato = nombres[i];
            String categoria = obtenerValor(categorias, i);
            String region = obtenerValor(regiones, i);
            int cantidad = convertirEntero(obtenerValor(cantidades, i));
            double precio = convertirDecimal(obtenerValor(precios, i));
            double subtotal = cantidad * precio;

            int idComida =
                platoDAO.obtenerOCrearId(
                    nombrePlato,
                    categoria,
                    region,
                    precio
                );

            if (idComida > 0 && cantidad > 0) {
                DetallePedido detalle =
                    new DetallePedido(
                        idPedido,
                        idComida,
                        cantidad,
                        precio,
                        subtotal
                    );

                detalleDAO.guardarDetalle(detalle);
            }
        }

        return idPedido;
    }

    private String obtenerValor(String[] valores, int posicion) {

        if (valores == null || posicion >= valores.length) {
            return "";
        }

        return valores[posicion];
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