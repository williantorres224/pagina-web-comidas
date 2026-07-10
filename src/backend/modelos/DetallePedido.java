package backend.modelos;

public class DetallePedido {

    private int idPedido;
    private int idComida;
    private int cantidad;
    private double precio;
    private double subtotal;

    public DetallePedido(
        int idPedido,
        int idComida,
        int cantidad,
        double precio,
        double subtotal
    ) {
        this.idPedido = idPedido;
        this.idComida = idComida;
        this.cantidad = cantidad;
        this.precio = precio;
        this.subtotal = subtotal;
    }

    public int getIdPedido() {
        return idPedido;
    }

    public int getIdComida() {
        return idComida;
    }

    public int getCantidad() {
        return cantidad;
    }

    public double getPrecio() {
        return precio;
    }

    public double getSubtotal() {
        return subtotal;
    }
}
