import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function Assinatura({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [assinatura, setAssinatura] = useState<any>(null);

  // ========================
  // FUNÇÕES DE FIREBASE
  // ========================
  async function carregarStatus() {
    const user = auth.currentUser;
    if (!user) return navigation.replace("Login");

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const assRef = doc(db, "assinaturas", user.uid);
      const assSnap = await getDoc(assRef);

      setIsPremium(userSnap.exists() ? userSnap.data()?.isPremium ?? false : false);
      setAssinatura(assSnap.exists() ? assSnap.data() : null);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar a assinatura");
    } finally {
      setLoading(false);
    }
  }

  async function ativarAssinatura() {
    const user = auth.currentUser;
    if (!user) return;
    setProcessing(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const assRef = doc(db, "assinaturas", user.uid);

      await setDoc(userRef, { isPremium: true }, { merge: true });
      await setDoc(
        assRef,
        { userId: user.uid, plano: "mensal", status: "ativo", dataInicio: serverTimestamp() },
        { merge: true }
      );

      setIsPremium(true);
      setAssinatura({ plano: "mensal", status: "ativo" });
      Alert.alert("Sucesso", "Assinatura ativada");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível ativar a assinatura");
    } finally {
      setProcessing(false);
    }
  }

  async function cancelarAssinatura() {
    const user = auth.currentUser;
    if (!user) return;

    Alert.alert("Cancelar assinatura", "Deseja realmente cancelar?", [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        style: "destructive",
        onPress: async () => {
          setProcessing(true);
          try {
            const userRef = doc(db, "users", user.uid);
            const assRef = doc(db, "assinaturas", user.uid);

            await updateDoc(userRef, { isPremium: false });
            await setDoc(
              assRef,
              { status: "cancelado", dataCancelamento: serverTimestamp() },
              { merge: true }
            );

            setIsPremium(false);
            setAssinatura({ ...assinatura, status: "cancelado" });
            Alert.alert("Sucesso", "Assinatura cancelada");
          } catch {
            Alert.alert("Erro", "Não foi possível cancelar a assinatura");
          } finally {
            setProcessing(false);
          }
        },
      },
    ]);
  }

  // ========================
  // CARREGAMENTO INICIAL
  // ========================
  useEffect(() => {
    carregarStatus();
  }, []);

  if (loading)
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );

  // ========================
  // RENDER
  // ========================
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container}>
        {/* Voltar */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={s.back}>← Voltar</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={s.title}>Assinatura</Text>

        {/* Status e Plano */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Plano Mensal — LuaTask Premium</Text>
          <Text style={s.cardSub}>Desbloqueia tema Dark e permite criar mais de 5 atividades.</Text>

          <View style={s.row}>
            <Text style={s.label}>Status:</Text>
            <Text style={[s.status, isPremium ? s.green : s.red]}>
              {isPremium ? "Premium ativo" : "Gratuito"}
            </Text>
          </View>

          {/* Botões */}
          <View style={{ marginTop: 12 }}>
            {!isPremium ? (
              <TouchableOpacity
                style={[s.button, processing && s.disabled]}
                onPress={ativarAssinatura}
                disabled={processing}
              >
                <Text style={s.buttonText}>{processing ? "Processando..." : "Ativar Mensal (R$4,90)"}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[s.buttonCancel, processing && s.disabled]}
                onPress={cancelarAssinatura}
                disabled={processing}
              >
                <Text style={s.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingTop: 30, flexGrow: 1 },
  back: { fontSize: 18, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 18, textAlign: "center" },
  card: { backgroundColor: "#f6f8fa", borderRadius: 12, padding: 18, marginBottom: 18 },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  cardSub: { marginTop: 8, color: "#333" },
  row: { flexDirection: "row", marginTop: 12, alignItems: "center" },
  label: { width: 100, fontWeight: "600", color: "#333" },
  status: { fontWeight: "700" },
  green: { color: "#28a745" },
  red: { color: "red" },
  button: { marginTop: 14, backgroundColor: "#28a745", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  buttonCancel: { marginTop: 14, backgroundColor: "#d9534f", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
  disabled: { opacity: 0.7 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
