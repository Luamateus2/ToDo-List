import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Home({ navigation }: any) {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigation.replace("Login");
    });
    return unsub;
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(lista);
    });
    return unsub;
  }, []);

  const meses = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  const diasSemanaISO = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const diaSemanaAtual = diasSemanaISO[selectedDay.getDay()];

  function formatDate(date: Date) {
    return `${date.getDate()} ${meses[date.getMonth()]} ${date.getFullYear()}`;
  }

  function previousDay() {
    const newDate = new Date(selectedDay);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDay(newDate);
  }

  function nextDay() {
    const newDate = new Date(selectedDay);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDay(newDate);
  }

  const dailyTasks = tasks.filter((t) => {
    if (t.diaria) return true;
    return t.dias?.includes(diaSemanaAtual);
  });

  async function excluir(id: string) {
    await deleteDoc(doc(db, "tasks", id));
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top","left","right"]}>
      <View style={styles.container}>

        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Text style={styles.title}>LuaTask</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Configuracoes")}>
            <Text style={styles.config}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* DATA */}
        <View style={styles.dateRow}>
          <TouchableOpacity onPress={previousDay}>
            <Text style={styles.arrow}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDate(selectedDay)}</Text>
          <TouchableOpacity onPress={nextDay}>
            <Text style={styles.arrow}>{">"}</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE TAREFAS */}
        <FlatList
          data={dailyTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.task}>
              <Text style={styles.taskText}>{item.titulo}</Text>
              <View style={styles.actions}>

                {/* Botão Editar com nome */}
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate("EditarTarefa", { id: item.id })}
                >
                  <Text style={styles.editText}>Editar</Text>
                </TouchableOpacity>

                {/* Botão Excluir */}
                <TouchableOpacity onPress={() => excluir(item.id)}>
                  <Text style={styles.delete}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("AdicionarTarefa")}
            >
              <Text style={styles.buttonText}>Adicionar Tarefa</Text>
            </TouchableOpacity>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  title: { fontSize: 28, fontWeight: "bold" },
  config: { fontSize: 30, paddingHorizontal: 10 },

  dateRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  arrow: { fontSize: 32, fontWeight: "bold", paddingHorizontal: 20, color: "#595959" },
  dateText: { fontSize: 20, fontWeight: "bold" },

  task: { paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  taskText: { fontSize: 18 },
  actions: { flexDirection: "row", alignItems: "center" },

  editButton: { backgroundColor: "#595959", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 10 },
  editText: { color: "#fff", fontWeight: "bold" },

  delete: { color: "#595959", fontSize: 20, fontWeight: "bold", paddingHorizontal: 10 },

  button: { backgroundColor: "#595959", padding: 16, borderRadius: 10, marginVertical: 20 },
  buttonText: { textAlign: "center", color: "#fff", fontSize: 17, fontWeight: "bold" },
});
