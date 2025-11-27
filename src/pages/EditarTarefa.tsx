import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch
} from "react-native";

import { db, auth } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

export default function EditarTarefa({ route, navigation }: any) {
  const { id } = route.params;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [diaria, setDiaria] = useState(false);

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];

  useEffect(() => {
    async function carregarTarefa() {
      const ref = doc(db, "tasks", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const dados = snap.data();

        setTitulo(dados.titulo || "");
        setDescricao(dados.descricao || "");
        setDiasSelecionados(dados.dias || []);
        setDiaria(dados.diaria || false);
      }
    }

    carregarTarefa();
  }, []);

  function toggleDia(dia: string) {
    if (diasSelecionados.includes(dia)) {
      setDiasSelecionados(diasSelecionados.filter((d) => d !== dia));
    } else {
      setDiasSelecionados([...diasSelecionados, dia]);
    }
  }

  async function salvar() {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "tasks", id);

    await updateDoc(ref, {
      titulo,
      descricao,
      dias: diaria ? [] : diasSelecionados,
      diaria,
      uid: user.uid,
    });

    alert("Tarefa atualizada!");
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Editar Tarefa</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Digite o título"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Escreva uma descrição (opcional)"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>Tarefa diária</Text>
        <Switch value={diaria} onValueChange={setDiaria} />
      </View>

      {!diaria && (
        <>
          <Text style={styles.label}>Dias da semana</Text>

          <View style={styles.diasRow}>
            {diasSemana.map((dia) => (
              <TouchableOpacity
                key={dia}
                style={[
                  styles.diaBtn,
                  diasSelecionados.includes(dia) && styles.diaSelecionado,
                ]}
                onPress={() => toggleDia(dia)}
              >
                <Text
                  style={[
                    styles.diaText,
                    diasSelecionados.includes(dia) && styles.diaTextSel,
                  ]}
                >
                  {dia}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.btnSalvar} onPress={salvar}>
        <Text style={styles.btnText}>Salvar Alterações</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 40,   
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  diasRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  diaBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999",
  },
  diaSelecionado: {
    backgroundColor: "#595959",
    borderColor: "#595959",
  },
  diaText: {
    fontSize: 16,
  },
  diaTextSel: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnSalvar: {
    backgroundColor: "#595959",
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
  },
});
