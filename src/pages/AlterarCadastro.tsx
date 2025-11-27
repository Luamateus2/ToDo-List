import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { auth, db } from "../firebase";
import {
  updateEmail,
  updatePassword,
} from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

export default function AlterarCadastro({ navigation }: any) {
  const user = auth.currentUser;

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [senha, setSenha] = useState("");

  // BUSCA DADOS NO FIRESTORE
  useEffect(() => {
    async function carregarDados() {
      if (!user) return;
      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const dados = snap.data();
        setNome(dados.nome || "");
      }
    }
    carregarDados();
  }, []);

  async function salvar() {
    try {
      if (!user) return;

      await updateDoc(doc(db, "usuarios", user.uid), { nome });

      if (email !== user.email) {
        await updateEmail(user, email);
      }

      if (senha.trim().length > 0) {
        await updatePassword(user, senha);
      }

      Alert.alert("Sucesso", "Cadastro atualizado!");
      navigation.goBack();

    } catch (e: any) {
      Alert.alert("Erro", e.message);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <Text style={styles.title}>Alterar Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha (opcional)"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={salvar}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#595959",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
