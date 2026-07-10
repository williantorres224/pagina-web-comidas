package backend.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;

import backend.conexion.Conexion;
import backend.modelos.DetallePedido;

public class DetallePedidoDAO {

    public boolean guardarDetalle(DetallePedido detalle) {

        String sql =
            "INSERT INTO detalle_pedido" +
            "(id_pedido,id_comida,cantidad,precio,subtotal) " +
            "VALUES(?,?,?,?,?)";

        try {

            Connection con = Conexion.conectar();

            if (con == null) {
                return false;
            }

            PreparedStatement ps =
                con.prepareStatement(sql);

            ps.setInt(1, detalle.getIdPedido());
            ps.setInt(2, detalle.getIdComida());
            ps.setInt(3, detalle.getCantidad());
            ps.setDouble(4, detalle.getPrecio());
            ps.setDouble(5, detalle.getSubtotal());

            int filas = ps.executeUpdate();

            con.close();

            return filas > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }
}