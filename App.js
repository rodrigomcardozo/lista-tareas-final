
import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  Keyboard,
  StyleSheet
} from 'react-native';


export default function App() {

  // ESTADOS
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [tareas, setTareas] = useState([]);  
  const [filtro, setFiltro] = useState('todas');

  // AGREGAR TAREA Y DETECTAR CÓDIGO SECRETO
  function agregarTarea() {

    const texto = nuevaTarea.trim();
    Keyboard.dismiss();

    // Detectar el código secreto
    if (texto === '123456') {
      Alert.alert(
        '¡Código secreto descubierto!',
        '¡Felicitaciones! Encontraste la función oculta de la aplicación.'
      );

      setNuevaTarea('');
      return;
    }

    // Evitar tareas vacías
    if (texto === '') {
      return;
    }

    // Crear una nueva tarea
    const tarea = {
      id: Date.now().toString(),
      titulo: texto,
      completada: false
    };

    // Agregarla a la lista
    setTareas(listaActual => [...listaActual, tarea]);

    // Limpiar el campo
    setNuevaTarea('');
  }

  // CAMBIAR ESTADO DE UNA TAREA
  function cambiarEstado(id) {

    setTareas(listaActual =>
      listaActual.map(tarea => {

        if (tarea.id === id) {
          return {
            ...tarea,
            completada: !tarea.completada
          };
        }

        return tarea;
      })
    );
  }

  // ELIMINAR UNA TAREA
  function eliminarTarea(id) {

    setTareas(listaActual =>
      listaActual.filter(tarea => tarea.id !== id)
    );
  }

  
  // CONTADORES DE TAREAS
  const totalTareas = tareas.length;

  const tareasCompletadas = tareas.filter(
    tarea => tarea.completada === true
  ).length;

  const tareasPendientes = totalTareas - tareasCompletadas;

  
  // FILTRAR LAS TAREAS SEGÚN SU ESTADO
  const tareasVisibles = tareas.filter(tarea => {

    if (filtro === 'pendientes') {
      return tarea.completada === false;
    }

    if (filtro === 'completadas') {
      return tarea.completada === true;
    }

    return true;
  });

  // INTERFAZ DE LA APLICACIÓN
  return (
    <View style={styles.contenedor}>

      <Text style={styles.titulo}>
        Mi lista de tareas
      </Text>

      <Text style={styles.subtitulo}>
        Organiza tus actividades diarias
      </Text>

      <TextInput
        style={styles.campo}
        placeholder="Escribí una tarea..."
        value={nuevaTarea}
        onChangeText={setNuevaTarea}
      />

      <View style={styles.boton}>
        <Button
          title="Agregar tarea"
          onPress={agregarTarea}
        />
      </View>

      <Text style={styles.encabezado}>
        Mis tareas
      </Text>

      <Text style={styles.resumen}>
        Total: {totalTareas}  |  Pendientes: {tareasPendientes}
      </Text>

      <Text style={styles.resumen}>
        Completadas: {tareasCompletadas}
      </Text>


    <View style={styles.filaFiltros}>

      <View style={styles.botonFiltro}>
        <Button
          title="Todas"
          color={filtro === 'todas' ? '#1565C0' : '#9E9E9E'}
          onPress={() => setFiltro('todas')}
        />
      </View>

      <View style={styles.botonFiltro}>
        <Button
          title="Pendientes"
          color={filtro === 'pendientes' ? '#1565C0' : '#9E9E9E'}
          onPress={() => setFiltro('pendientes')}
        />
      </View>

      <View style={styles.botonFiltro}>
        <Button
          title="Hechas"
          color={filtro === 'completadas' ? '#1565C0' : '#9E9E9E'}
          onPress={() => setFiltro('completadas')}
        />
      </View>

    </View>

      <ScrollView style={styles.lista}>

        {tareasVisibles.map((tarea) => (

          <View key={tarea.id} style={styles.elemento}>

            <Text
              style={[
                styles.textoTarea,
                tarea.completada && styles.tareaCompletada
              ]}
            >
              {tarea.titulo}
            </Text>

            <Text style={styles.estado}>
              {tarea.completada
                ? '✓ Completada'
                : '○ Pendiente'}
            </Text>

            <View style={styles.filaBotones}>

              <View style={styles.botonTarea}>
                <Button
                  title={tarea.completada ? 'Reabrir' : 'Completar'}
                  onPress={() => cambiarEstado(tarea.id)}
                />
              </View>

              <View style={styles.botonTarea}>
                <Button
                  title="Eliminar"
                  color="#C62828"
                  onPress={() => eliminarTarea(tarea.id)}
                />
              </View>

            </View>

          </View>

        ))}

      </ScrollView>

    </View>
  );

} // FIN DE LA FUNCIÓN APP

// ESTILOS VISUALES
const styles = StyleSheet.create({

  contenedor: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 24,
    paddingTop: 70,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
  },

  subtitulo: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
    marginBottom: 25,
  },

  campo: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },

  boton: {
    marginTop: 15,
  },

  encabezado: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
  },

  lista: {
    flex: 1,
  },

  elemento: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  textoTarea: {
    fontSize: 16,
    color: '#333333',
  },

  tareaCompletada: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },

  estado: {
    fontSize: 14,
    color: '#777777',
    marginTop: 8,
  },

  filaBotones: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },

  botonTarea: {
    flex: 1,
  },


  resumen: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 8,
  },

  
  filaFiltros: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
    gap: 5,
  },

  botonFiltro: {
    flex: 1,
  },

});
