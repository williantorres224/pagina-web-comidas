package backend.modelos;
 
public class Pago {
 
    private int id;
    private int idPedido;
    private String metodo;
    private double monto;
    private String estado;
 
    public Pago(
        int idPedido,
        String metodo,
        double monto,
        String estado
    ) {
        this.idPedido = idPedido;
        this.metodo = metodo;
        this.monto = monto;
        this.estado = estado;
    }
 
    public int getId() {
        return id;
    }
 
    public int getIdPedido() {
        return idPedido;
    }
 
    public String getMetodo() {
        return metodo;
    }
 
    public double getMonto() {
        return monto;
    }
 
    public String getEstado() {
        return estado;
    }
 
    public void setId(int id) {
        this.id = id;
    }
}