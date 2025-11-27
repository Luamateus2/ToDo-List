import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Configuracoes({ navigation }: any) {
  
  async function handleLogout() {
    await signOut(auth);
    navigation.replace("Login");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.container}>

        <Text style={styles.title}>Configurações</Text>

        <View style={styles.menu}>

      

          {/* ALTERAR CADASTRO */}
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate("AlterarCadastro")}
          >
            <Text style={styles.buttonText}>Alterar Cadastro</Text>
          </TouchableOpacity>

          {/* ASSINATURA */}
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate("Assinatura")}
          >
            <Text style={styles.buttonText}>Assinatura</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>⬅ Voltar</Text>
          </TouchableOpacity>
          {/* SAIR */}
          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}> Sair</Text>
          </TouchableOpacity>
          

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 25, paddingTop: 25 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  menu: { gap: 18 },
  button: {
    backgroundColor: "#e9e9e9",
    paddingVertical: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  buttonText: { fontSize: 18, fontWeight: "600" },
  logoutButton: { backgroundColor: "#d9534f" },
});
