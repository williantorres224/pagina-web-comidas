package backend.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import backend.conexion.Conexion;

public class PlatoDAO {

    public int obtenerOCrearId(
        String nombre,
        String categoria,
        String region,
        double precio
    ) {

        int idExistente = buscarIdPorNombre(nombre);

        if (idExistente > 0) {
            return idExistente;
        }

        String sql =
            "INSERT INTO comidas(nombre,categoria,region,precio) " +
            "VALUES(?,?,?,?)";

        try {

            Connection con = Conexion.conectar();

            if (con == null) {
                return 0;
            }

            PreparedStatement ps =
                con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);

            ps.setString(1, nombre);
            ps.setString(2, categoria);
            ps.setString(3, region);
            ps.setDouble(4, precio);

            ps.executeUpdate();

            ResultSet rs = ps.getGeneratedKeys();

            int idComida = 0;

            if (rs.next()) {
                idComida = rs.getInt(1);
            }

            con.close();

            return idComida;

        } catch (Exception e) {

            e.printStackTrace();

            return 0;
        }
    }

    private int buscarIdPorNombre(String nombre) {

        String sql =
            "SELECT id FROM comidas WHERE nombre = ?";

        try {

            Connection con = Conexion.conectar();

            if (con == null) {
                return 0;
            }

            PreparedStatement ps =
                con.prepareStatement(sql);

            ps.setString(1, nombre);

            ResultSet rs = ps.executeQuery();

            int idComida = 0;

            if (rs.next()) {
                idComida = rs.getInt("id");
            }

            con.close();

            return idComida;

        } catch (Exception e) {

            e.printStackTrace();

            return 0;
        }
    }
}
