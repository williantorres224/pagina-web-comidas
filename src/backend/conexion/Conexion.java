package backend.conexion;

import java.sql.Connection;
import java.sql.DriverManager;

public class Conexion {

    private static final String URL =
            System.getenv("DB_URL");

    private static final String USUARIO =
            System.getenv("DB_USER");

    private static final String PASSWORD =
            System.getenv("DB_PASSWORD");

    public static Connection conectar() {

        try {

            Class.forName("com.mysql.cj.jdbc.Driver");

            return DriverManager.getConnection(
                    URL,
                    USUARIO,
                    PASSWORD
            );

        } catch (Exception e) {

            e.printStackTrace();
            return null;

        }
    }
}