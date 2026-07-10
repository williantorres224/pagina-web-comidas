package backend.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import backend.conexion.Conexion;
import backend.modelos.Cliente;

public class ClienteDAO {

    public int guardarClienteYRetornarId(Cliente cliente) {

        String sql =
            "INSERT INTO clientes(nombre,direccion,correo,celular) " +
            "VALUES(?,?,?,?)";

        try {

            Connection con =
                Conexion.conectar();

            if (con == null) {
                return 0;
            }

            PreparedStatement ps =
                con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setString(1, cliente.getNombre());
            ps.setString(2, cliente.getDireccion());
            ps.setString(3, cliente.getCorreo());
            ps.setString(4, cliente.getCelular());

            int filas = ps.executeUpdate();

            if (filas == 0) {
                con.close();
                return 0;
            }

            ResultSet rs = ps.getGeneratedKeys();

            int idCliente = 0;

            if (rs.next()) {
                idCliente = rs.getInt(1);
            }

            con.close();

            return idCliente;

        } catch (Exception e) {

            e.printStackTrace();

            return 0;
        }
    }

    public boolean guardarCliente(Cliente cliente) {

        return guardarClienteYRetornarId(cliente) > 0;
    }
}
