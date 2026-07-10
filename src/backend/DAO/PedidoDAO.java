package backend.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import backend.conexion.Conexion;
import backend.modelos.Pedido;

public class PedidoDAO {

    public int guardarPedidoYRetornarId(Pedido pedido) {

        String sql =
            "INSERT INTO pedidos(id_cliente) VALUES(?)";

        try {

            Connection con = Conexion.conectar();

            if (con == null) {
                return 0;
            }

            PreparedStatement ps =
                con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setInt(1, pedido.getIdCliente());

            int filas = ps.executeUpdate();

            if (filas == 0) {
                con.close();
                return 0;
            }

            ResultSet rs = ps.getGeneratedKeys();

            int idPedido = 0;

            if (rs.next()) {
                idPedido = rs.getInt(1);
            }

            con.close();

            return idPedido;

        } catch(Exception e) {

            e.printStackTrace();

            return 0;
        }
    }

    public boolean guardarPedido(Pedido pedido) {

        return guardarPedidoYRetornarId(pedido) > 0;
    }
}
