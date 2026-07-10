package backend.modelos;

public class Pedido {

    private int id;
    private int idCliente;

    public Pedido(int idCliente) {
        this.idCliente = idCliente;
    }

    public int getId() {
        return id;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }
}