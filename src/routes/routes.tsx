import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../pages/Login";
import RegisterScreen from "../pages/Cadastro";
import Home from "../pages/Home";
import AdicionarTarefa from "../pages/AdicionarTarefa";
import Configuracoes from "../pages/Configuracoes";
import { RootStackParamList } from "./types"; 
import EditarTarefa from "../pages/EditarTarefa";
import AlterarCadastro from "../pages/AlterarCadastro";
import Assinatura from "../pages/Assinatura";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AdicionarTarefa" component={AdicionarTarefa} />
      <Stack.Screen name="EditarTarefa" component={EditarTarefa} />
      <Stack.Screen name="Configuracoes" component={Configuracoes} />
      <Stack.Screen name="AlterarCadastro" component={AlterarCadastro} />
      <Stack.Screen name="Assinatura" component={Assinatura} />

    </Stack.Navigator>
  );
}
