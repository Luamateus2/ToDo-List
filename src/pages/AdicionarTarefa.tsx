import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../routes/types";

// FIREBASE
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

type Nav = NativeStackNavigationProp<RootStackParamList, "AdicionarTarefa">;

export default function AdicionarTarefa() {
  const navigation = useNavigation<Nav>();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);

  const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  function toggleDia(dia: string) {
    if (diasSelecionados.includes(dia)) {
      setDiasSelecionados(diasSelecionados.filter((d) => d !== dia));
    } else {
      setDiasSelecionados([...diasSelecionados, dia]);
    }
  }

  function selecionarTodos() {
    if (diasSelecionados.length === 7) {
      setDiasSelecionados([]);
    } else {
      setDiasSelecionados([...diasDaSemana]);
    }
  }

  function wait(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async function salvarTarefa() {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não está logado.");
      return;
    }

    if (titulo.trim().length === 0) {
      Alert.alert("Atenção", "Digite um título.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        uid: user.uid,
        titulo,
        descricao,
        dias: diasSelecionados,
        diaria: diasSelecionados.length === 7,
        criadoEm: new Date(),
      });

      setModalVisible(true);
      await wait(200);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a tarefa.");
    }
  }

  // pega altura da tela
  const screenHeight = Dimensions.get("window").height;

  return (
    <View style={styles.container}>

      {/* 🔥 TÍTULO MAIS BAIXO (USANDO MARGIN TOP RESPONSIVA) */}
      <Text style={[styles.title, { marginTop: screenHeight * 0.05 }]}>
        Criar nova tarefa
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Descrição"
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.subtitle}>Repetir em:</Text>

      <View style={styles.diasContainer}>
        {diasDaSemana.map((dia) => {
          const selecionado = diasSelecionados.includes(dia);
          return (
            <TouchableOpacity
              key={dia}
              style={[
                styles.diaButton,
                selecionado && styles.diaSelecionado,
              ]}
              onPress={() => toggleDia(dia)}
            >
              <Text
                style={[
                  styles.diaText,
                  selecionado && { color: "#FFF" },
                ]}
              >
                {dia}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 🔥 BOTÃO DARK — "Selecionar todos" */}
      <TouchableOpacity style={styles.buttonDark} onPress={selecionarTodos}>
        <Text style={styles.buttonDarkText}>
          {diasSelecionados.length === 7
            ? "Desmarcar todos"
            : "Selecionar todos os dias"}
        </Text>
      </TouchableOpacity>

      {/* 🔥 BOTÃO DARK — "Salvar" */}
      <TouchableOpacity style={styles.buttonDark} onPress={salvarTarefa}>
        <Text style={styles.buttonDarkText}>Salvar Tarefa</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          navigation.replace("Home");
        }}
      >
        <View style={[styles.modalFundo, { flex: 1 }]}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Tarefa salva com sucesso! 🎉</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={async () => {
                setModalVisible(false);
                await wait(150);
                navigation.replace("Home");
              }}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF", // NÃO FOI ALTERADO
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#F2F2F2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  diasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 15,
  },

  diaButton: {
    width: "30%",
    paddingVertical: 12,
    backgroundColor: "#E3E3E3",
    borderRadius: 10,
    alignItems: "center",
  },

  diaSelecionado: {
    backgroundColor: "#6200EE",
  },

  diaText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  /* 🔥 BOTÕES DARK */
  buttonDark: {
    backgroundColor: "#595959", // dark
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  buttonDarkText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  modalFundo: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#595959",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },

  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  modalButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },

  modalButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
































































































































































