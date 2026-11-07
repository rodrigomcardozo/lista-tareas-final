import { useState } from 'react';
import {
  Alert,
  Button,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@react-native-vector-icons/feather';

// Íconos.
const ICONOS = {
  code: { color: '#5165D9', fondo: '#E9ECFF', descripcion: 'Código' },
  monitor: { color: '#2290C3', fondo: '#DFF3FF', descripcion: 'PC' },
  'shopping-cart': { color: '#D79B13', fondo: '#FFF2C9', descripcion: 'Compras' },
  mail: { color: '#B55ABB', fondo: '#F6E5F8', descripcion: 'Correo' },
  layout: { color: '#DE6655', fondo: '#FFEAE5', descripcion: 'Diseño' },
  'book-open': { color: '#6563CB', fondo: '#EEEAFE', descripcion: 'Lectura' },
  calendar: { color: '#9A65C0', fondo: '#F2E9FC', descripcion: 'Agenda' },
  clock: { color: '#C47A36', fondo: '#FFF0DF', descripcion: 'Tiempo' },
  'check-square': { color: '#248678', fondo: '#DDF6EF', descripcion: 'Lista' },
  'file-text': { color: '#2677B6', fondo: '#E2F1FF', descripcion: 'Archivo' },
  briefcase: { color: '#596C88', fondo: '#E8EDF5', descripcion: 'Trabajo' },
  home: { color: '#56904A', fondo: '#E8F5E2', descripcion: 'Casa' },
  coffee: { color: '#A06B48', fondo: '#F9EBDF', descripcion: 'Pausa' },
  heart: { color: '#C85072', fondo: '#FDE7EF', descripcion: 'Salud' },
  activity: { color: '#2A9270', fondo: '#E1F7EF', descripcion: 'Ejercicio' },
  camera: { color: '#BF578E', fondo: '#FCE7F4', descripcion: 'Foto' },
  music: { color: '#8B60C7', fondo: '#F0E7FB', descripcion: 'Música' },
  'dollar-sign': { color: '#A47A10', fondo: '#FFF4CC', descripcion: 'Dinero' },
  star: { color: '#D18817', fondo: '#FFF0CD', descripcion: 'Especial' },
  bookmark: { color: '#2673AA', fondo: '#E4F1FD', descripcion: 'Guardar' },
};

const PRIORIDADES = {
  alta: { texto: 'Alta', color: '#CB4750', fondo: '#FFEAED', orden: 0 },
  media: { texto: 'Media', color: '#9B6E08', fondo: '#FFF1C9', orden: 1 },
  baja: { texto: 'Baja', color: '#227D77', fondo: '#DDF8F4', orden: 2 },
};

// Se muestran cada vez que se inicia de cero la aplicación.
const TAREAS_DE_EJEMPLO = [
  {
    id: 'ejemplo-1',
    titulo: 'Presentar prototipo de sitio web',
    completada: false,
    prioridad: 'alta',
    icono: 'layout',
    orden: 1,
  },
  {
    id: 'ejemplo-2',
    titulo: 'Corregir error en formulario de contacto',
    completada: false,
    prioridad: 'alta',
    icono: 'code',
    orden: 2,
  },
  {
    id: 'ejemplo-3',
    titulo: 'Buscar memoria RAM en Mercado Libre',
    completada: false,
    prioridad: 'media',
    icono: 'monitor',
    orden: 3,
  },
  {
    id: 'ejemplo-4',
    titulo: 'Enviar mail a Juan',
    completada: true,
    prioridad: 'media',
    icono: 'mail',
    orden: 4,
  },
  {
    id: 'ejemplo-5',
    titulo: 'Comprar pan',
    completada: true,
    prioridad: 'baja',
    icono: 'shopping-cart',
    orden: 5,
  },
];

export default function App() {
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [iconoElegido, setIconoElegido] = useState(null);
  const [selectorIconosAbierto, setSelectorIconosAbierto] = useState(false);
  const [tareas, setTareas] = useState(TAREAS_DE_EJEMPLO);
  const [filtro, setFiltro] = useState('todas');
  const [idParaPrioridad, setIdParaPrioridad] = useState(null);

  const totalTareas = tareas.length;
  const tareasCompletadas = tareas.filter(tarea => tarea.completada).length;
  const tareasPendientes = totalTareas - tareasCompletadas;

  // Filtramos y ordenamos una COPIA; el array de estado no se modifica.
  const tareasVisibles = tareas
    .filter(tarea => {
      if (filtro === 'pendientes') return !tarea.completada;
      if (filtro === 'completadas') return tarea.completada;
      return true;
    })
    .sort((a, b) => {
      if (a.completada !== b.completada) return a.completada ? 1 : -1;
      const diferencia = PRIORIDADES[a.prioridad].orden - PRIORIDADES[b.prioridad].orden;
      return diferencia !== 0 ? diferencia : a.orden - b.orden;
    });

  const tareaEditada = tareas.find(tarea => tarea.id === idParaPrioridad);

  function agregarTarea() {
    const texto = nuevaTarea.trim();
    Keyboard.dismiss();

    // Requisito obligatorio: el código no se agrega como una tarea normal.
    if (texto === '123456') {
      Alert.alert(
        '¡Código secreto descubierto!',
        '¡Felicitaciones! Encontraste la función oculta de la aplicación.'
      );
      setNuevaTarea('');
      setIconoElegido(null);
      setSelectorIconosAbierto(false);
      return;
    }

    if (texto === '') return;

    const nueva = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      titulo: texto,
      completada: false,
      prioridad: 'media',
      // Sin elección explícita, se usa el ícono de código por defecto.
      icono: iconoElegido || 'code',
      orden: Date.now(),
    };

    setTareas(listaActual => [...listaActual, nueva]);
    setNuevaTarea('');
    setIconoElegido(null);
    setSelectorIconosAbierto(false);
    setFiltro('todas');
  }

  function cambiarEstado(id) {
    setTareas(listaActual =>
      listaActual.map(tarea =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
      )
    );
  }

  function eliminarTarea(id) {
    setTareas(listaActual => listaActual.filter(tarea => tarea.id !== id));
  }

  function cambiarPrioridad(prioridad) {
    setTareas(listaActual =>
      listaActual.map(tarea =>
        tarea.id === idParaPrioridad ? { ...tarea, prioridad } : tarea
      )
    );
    setIdParaPrioridad(null);
  }

  return (
    <View style={styles.pantalla}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FC" />
      <ScrollView
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.encabezado}>
          <View style={styles.distintivo}>
            <Feather name="zap" size={14} color="#D9534C" />
            <Text style={styles.distintivoTexto}>¿Qué hay en tu cabeza?</Text>
          </View>
          <Text style={styles.titulo}>
            Mis tareas<Text style={styles.punto}>.</Text>
          </Text>
          <Text style={styles.subtitulo}>
            Anotá lo que tenés pendiente. Lo demás, paso a paso.
          </Text>
        </View>

        <View style={styles.resumenFila}>
          <View style={styles.resumenTarjeta}>
            <Text style={styles.resumenNumero}>{totalTareas}</Text>
            <Text style={styles.resumenEtiqueta}>Total</Text>
          </View>
          <View style={styles.resumenTarjeta}>
            <Text style={[styles.resumenNumero, { color: '#256BC7' }]}>
              {tareasPendientes}
            </Text>
            <Text style={styles.resumenEtiqueta}>Pendientes</Text>
          </View>
          <View style={styles.resumenTarjeta}>
            <Text style={[styles.resumenNumero, { color: '#23846F' }]}>
              {tareasCompletadas}
            </Text>
            <Text style={styles.resumenEtiqueta}>Hechas</Text>
          </View>
        </View>

        <View style={styles.bloqueAgregar}>
          <Text style={styles.etiquetaSeccion}>NUEVA TAREA</Text>
          <View style={styles.filaCampo}>
            <Pressable
              style={[
                styles.botonElegirIcono,
                {
                  backgroundColor: iconoElegido
                    ? ICONOS[iconoElegido].fondo
                    : '#EFF3FA',
                },
                selectorIconosAbierto && styles.botonElegirIconoActivo,
              ]}
              onPress={() => {
                Keyboard.dismiss();
                setSelectorIconosAbierto(abierto => !abierto);
              }}
              accessibilityRole="button"
              accessibilityLabel={iconoElegido
                ? `Cambiar ícono. Actual: ${ICONOS[iconoElegido].descripcion}`
                : 'Elegir ícono para la nueva tarea'}
              accessibilityState={{ expanded: selectorIconosAbierto }}
            >
              <Feather
                name={iconoElegido || 'edit-2'}
                size={21}
                color={iconoElegido ? ICONOS[iconoElegido].color : '#68758C'}
              />
            </Pressable>
            <TextInput
              style={styles.campo}
              placeholder="¿Qué tenés que hacer?"
              placeholderTextColor="#969CAA"
              value={nuevaTarea}
              onChangeText={setNuevaTarea}
              returnKeyType="done"
              onSubmitEditing={agregarTarea}
            />
          </View>

          {selectorIconosAbierto && (
            <View style={styles.selectorIconos}>
              <View style={styles.selectorEncabezado}>
                <Text style={styles.selectorTitulo}>Elegí un ícono</Text>
                <Text style={styles.selectorCantidad}>20 opciones</Text>
              </View>
              <View style={styles.cuadriculaIconos}>
                {Object.keys(ICONOS).map(nombre => (
                  <Pressable
                    key={nombre}
                    accessibilityRole="button"
                    accessibilityLabel={`Ícono: ${ICONOS[nombre].descripcion}`}
                    accessibilityState={{ selected: iconoElegido === nombre }}
                    onPress={() => {
                      setIconoElegido(nombre);
                      setSelectorIconosAbierto(false);
                    }}
                    style={[
                      styles.iconoOpcion,
                      { backgroundColor: ICONOS[nombre].fondo },
                      iconoElegido === nombre && styles.iconoSeleccionado,
                    ]}
                  >
                    <Feather name={nombre} color={ICONOS[nombre].color} size={21} />
                    <Text style={styles.iconoDescripcion} numberOfLines={1}>
                      {ICONOS[nombre].descripcion}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          <Pressable
            style={styles.botonAgregar}
            onPress={agregarTarea}
            accessibilityRole="button"
          >
            <Feather name="plus" size={19} color="#FFFFFF" />
            <Text style={styles.textoAgregar}>Agregar tarea</Text>
          </Pressable>
        </View>

        <View style={styles.filaTituloLista}>
          <Text style={styles.tituloLista}>Mis tareas</Text>
          <Text style={styles.cantidadVisible}>{tareasVisibles.length} visibles</Text>
        </View>

        <View style={styles.filtros}>
          {[
            { id: 'todas', texto: 'Todas' },
            { id: 'pendientes', texto: 'Pendientes' },
            { id: 'completadas', texto: 'Hechas' },
          ].map(opcion => (
            <Pressable
              key={opcion.id}
              onPress={() => setFiltro(opcion.id)}
              style={[
                styles.botonFiltro,
                filtro === opcion.id && styles.botonFiltroActivo,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: filtro === opcion.id }}
            >
              <Text
                style={[
                  styles.textoFiltro,
                  filtro === opcion.id && styles.textoFiltroActivo,
                ]}
              >
                {opcion.texto}
              </Text>
            </Pressable>
          ))}
        </View>

        {tareasVisibles.length === 0 ? (
          <View style={styles.vacio}>
            <Feather name="inbox" size={30} color="#A1A7B5" />
            <Text style={styles.vacioTexto}>No hay tareas en esta vista.</Text>
          </View>
        ) : (
          tareasVisibles.map(tarea => {
            const icono = ICONOS[tarea.icono] || ICONOS.code;
            const prioridad = PRIORIDADES[tarea.prioridad] || PRIORIDADES.media;
            return (
              <View key={tarea.id} style={styles.tarjetaTarea}>
                <View style={styles.filaTarea}>
                  <View style={[styles.iconoTarea, { backgroundColor: icono.fondo }]}>
                    <Feather name={ICONOS[tarea.icono] ? tarea.icono : "code"} size={22} color={icono.color} />
                  </View>
                  <View style={styles.infoTarea}>
                    <Text
                      style={[
                        styles.nombreTarea,
                        tarea.completada && styles.nombreTareaHecha,
                      ]}
                    >
                      {tarea.titulo}
                    </Text>
                    <View style={styles.estadoFila}>
                      <Feather
                        name={tarea.completada ? 'check-circle' : 'circle'}
                        size={13}
                        color={tarea.completada ? '#23846F' : '#9DA2AF'}
                      />
                      <Text style={styles.estadoTexto}>
                        {tarea.completada ? 'Hecha' : 'Pendiente'}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => setIdParaPrioridad(tarea.id)}
                    style={[styles.prioridadBoton, { backgroundColor: prioridad.fondo }]}
                    accessibilityRole="button"
                    accessibilityLabel={`Cambiar prioridad. Actual: ${prioridad.texto}`}
                  >
                    <Feather name="flag" size={12} color={prioridad.color} />
                    <Text style={[styles.prioridadTexto, { color: prioridad.color }]}>
                      {prioridad.texto}
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.filaAcciones}>
                  <Pressable
                    style={[styles.accionBoton, styles.accionPrincipal]}
                    onPress={() => cambiarEstado(tarea.id)}
                    accessibilityRole="button"
                  >
                    <Feather
                      name={tarea.completada ? 'rotate-ccw' : 'check'}
                      size={16}
                      color="#2468C4"
                    />
                    <Text style={styles.accionPrincipalTexto}>
                      {tarea.completada ? 'Reabrir' : 'Completar'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.accionBoton, styles.accionEliminar]}
                    onPress={() => eliminarTarea(tarea.id)}
                    accessibilityRole="button"
                  >
                    <Feather name="trash-2" size={16} color="#BD4B55" />
                    <Text style={styles.accionEliminarTexto}>Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={idParaPrioridad !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setIdParaPrioridad(null)}
      >
        <View style={styles.fondoModal}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setIdParaPrioridad(null)}
            accessibilityLabel="Cerrar menú de prioridad"
          />
          <View style={styles.modalTarjeta}>
            <Text style={styles.modalTitulo}>Elegí la prioridad</Text>
            <Text style={styles.modalSubtitulo} numberOfLines={2}>
              {tareaEditada?.titulo || 'Tarea'}
            </Text>
            {Object.keys(PRIORIDADES).map(nivel => (
              <Pressable
                key={nivel}
                style={styles.modalOpcion}
                onPress={() => cambiarPrioridad(nivel)}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.puntoPrioridad,
                    { backgroundColor: PRIORIDADES[nivel].color },
                  ]}
                />
                <Text style={styles.modalOpcionTexto}>{PRIORIDADES[nivel].texto}</Text>
                {tareaEditada?.prioridad === nivel && (
                  <Feather name="check" size={20} color="#2468C4" />
                )}
              </Pressable>
            ))}
            <View style={styles.modalCancelar}>
              <Button
                title="Cancelar"
                color="#69758A"
                onPress={() => setIdParaPrioridad(null)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#F7F8FC' },
  contenido: { paddingHorizontal: 18, paddingTop: 50, paddingBottom: 42 },
  encabezado: { marginBottom: 20 },
  distintivo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  distintivoTexto: { fontSize: 10, fontWeight: '800', letterSpacing: 1, color: '#C75B54' },
  titulo: { fontSize: 32, fontWeight: '800', color: '#1E2636' },
  punto: { color: '#EF6257' },
  subtitulo: { fontSize: 14, color: '#707989', marginTop: 6, lineHeight: 20 },
  resumenFila: { flexDirection: 'row', gap: 9, marginBottom: 18 },
  resumenTarjeta: {
    flex: 1, backgroundColor: '#FFFFFF', paddingVertical: 12, paddingHorizontal: 8,
    alignItems: 'center', borderRadius: 14, borderWidth: 1, borderColor: '#EDF0F5',
  },
  resumenNumero: { fontSize: 23, fontWeight: '800', color: '#20283A' },
  resumenEtiqueta: { fontSize: 11, color: '#758093', marginTop: 2 },
  bloqueAgregar: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 15,
    borderWidth: 1, borderColor: '#E8ECF4', marginBottom: 26,
  },
  etiquetaSeccion: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: '#677389', marginBottom: 11 },
  filaCampo: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  campo: {
    flex: 1, minWidth: 0,
    borderWidth: 1, borderColor: '#DDE3EE', borderRadius: 11,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#1E2636',
    backgroundColor: '#FBFCFF',
  },
  botonElegirIcono: {
    width: 49, height: 49, alignItems: 'center', justifyContent: 'center',
    borderRadius: 11, borderWidth: 1, borderColor: '#DDE3EE',
  },
  botonElegirIconoActivo: { borderColor: '#2468C4', borderWidth: 2 },
  selectorIconos: {
    marginTop: 10, padding: 10, borderRadius: 12, borderWidth: 1,
    borderColor: '#E8ECF4', backgroundColor: '#F7F9FD',
  },
  selectorEncabezado: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  selectorTitulo: { fontSize: 12, fontWeight: '700', color: '#4A576B' },
  selectorCantidad: { fontSize: 11, color: '#8994A4' },
  cuadriculaIconos: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    rowGap: 9,
  },
  iconoOpcion: {
    width: '23%', height: 65, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'transparent', paddingHorizontal: 2,
  },
  iconoDescripcion: {
    fontSize: 10, fontWeight: '600', color: '#485568', marginTop: 5,
    textAlign: 'center', width: '100%',
  },
  iconoSeleccionado: { borderColor: '#1D5EB8' },
  botonAgregar: {
    backgroundColor: '#EC5E53', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', borderRadius: 12, paddingVertical: 13, gap: 8,
    marginTop: 14,
  },
  textoAgregar: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  filaTituloLista: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  tituloLista: { fontSize: 21, fontWeight: '800', color: '#1E2636' },
  cantidadVisible: { fontSize: 12, color: '#7B8493' },
  filtros: { flexDirection: 'row', gap: 7, marginBottom: 15 },
  botonFiltro: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12,
    backgroundColor: '#E9EDF5', borderRadius: 10,
  },
  botonFiltroActivo: { backgroundColor: '#2468C4' },
  textoFiltro: { color: '#59677D', fontSize: 12, fontWeight: '700' },
  textoFiltroActivo: { color: '#FFFFFF' },
  tarjetaTarea: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    marginBottom: 11, borderWidth: 1, borderColor: '#E7EBF2',
  },
  filaTarea: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  iconoTarea: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  infoTarea: { flex: 1, minWidth: 0, paddingTop: 1 },
  nombreTarea: { fontSize: 15, fontWeight: '700', color: '#252D3B', lineHeight: 21 },
  nombreTareaHecha: { color: '#9399A5', textDecorationLine: 'line-through' },
  estadoFila: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  estadoTexto: { fontSize: 12, color: '#7E8897' },
  prioridadBoton: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 7,
  },
  prioridadTexto: { fontSize: 11, fontWeight: '800' },
  filaAcciones: { flexDirection: 'row', gap: 9, marginTop: 14 },
  accionBoton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 10, paddingVertical: 10, gap: 7,
  },
  accionPrincipal: { backgroundColor: '#EBF2FF' },
  accionPrincipalTexto: { color: '#2468C4', fontSize: 13, fontWeight: '700' },
  accionEliminar: { backgroundColor: '#FFF0F1' },
  accionEliminarTexto: { color: '#BD4B55', fontSize: 13, fontWeight: '700' },
  vacio: { alignItems: 'center', paddingVertical: 36, gap: 9 },
  vacioTexto: { fontSize: 14, color: '#8A93A0' },
  fondoModal: {
    flex: 1, backgroundColor: 'rgba(22,29,42,0.45)',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
  },
  modalTarjeta: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 21, width: '100%', maxWidth: 390 },
  modalTitulo: { fontSize: 20, fontWeight: '800', color: '#20283A' },
  modalSubtitulo: { fontSize: 13, color: '#7B8391', marginTop: 5, marginBottom: 17 },
  modalOpcion: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#EEF0F4', gap: 12,
  },
  puntoPrioridad: { width: 13, height: 13, borderRadius: 7 },
  modalOpcionTexto: { fontSize: 16, color: '#2B3444', flex: 1 },
  modalCancelar: { alignItems: 'center', paddingTop: 19, paddingBottom: 2 },
});
