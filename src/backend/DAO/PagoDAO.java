package backend.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;

import backend.conexion.Conexion;
import backend.modelos.Pago;

public class PagoDAO {

    public boolean guardarPago(Pago pago) {

        String sql =
            "INSERT INTO pagos(id_pedido,metodo,monto,estado) " +
            "VALUES(?,?,?,?)";

        try {

            Connection con = Conexion.conectar();

            if (con == null) {
                return false;
            }

            PreparedStatement ps =
                con.prepareStatement(sql);

            ps.setInt(1, pago.getIdPedido());
            ps.setString(2, pago.getMetodo());
            ps.setDouble(3, pago.getMonto());
            ps.setString(4, pago.getEstado());

            int filas = ps.executeUpdate();

            con.close();

            return filas > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }
}