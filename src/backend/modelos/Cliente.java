package backend.modelos;

public class Cliente {

    private String nombre;
    private String direccion;
    private String correo;
    private String celular;

    public Cliente(
        String nombre,
        String direccion,
        String correo,
        String celular
    ){
        this.nombre = nombre;
        this.direccion = direccion;
        this.correo = correo;
        this.celular = celular;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDireccion() {
        return direccion;
    }

    public String getCorreo() {
        return correo;
    }

    public String getCelular() {
        return celular;
    }
}