# Imagen de Tomcat con JDK completo (necesitamos javac, no solo java)
FROM tomcat:10.1-jdk21
 
ENV CATALINA_HOME=/usr/local/tomcat
 
# Limpia la app por defecto de Tomcat
RUN rm -rf $CATALINA_HOME/webapps/ROOT
 
# Copia el código fuente y el contenido web
COPY src /build/src
COPY WebContent $CATALINA_HOME/webapps/ROOT
 
# Compila todo el backend Java dentro de la imagen,
# usando las librerías del proyecto (mysql-connector, etc.)
# y las de Tomcat (servlet-api).
RUN javac -d $CATALINA_HOME/webapps/ROOT/WEB-INF/classes \
    -cp "$CATALINA_HOME/webapps/ROOT/WEB-INF/lib/*:$CATALINA_HOME/lib/*" \
    $(find /build/src -name "*.java")
 
EXPOSE 8080
 
CMD ["catalina.sh", "run"]
 