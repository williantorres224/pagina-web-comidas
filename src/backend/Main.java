package backend;

import backend.DAO.ClienteDAO;
import backend.modelos.Cliente;

public class Main {
    public static void main(String[] args) {

        Cliente cliente =
            new Cliente(
                null,
                null,
                null,
                null
            );

        ClienteDAO dao =
            new ClienteDAO();

        if(dao.guardarCliente(cliente)){
            System.out.println("Cliente guardado");
        }else{
            System.out.println("Error al guardar cliente");
        }
    }
}