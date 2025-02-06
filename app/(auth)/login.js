import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#7734eb' }}>
        InsightHub
      </Text>
      <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 10 }}>
        Welcome Back 👋
      </Text>
      <Text style={{ textAlign: 'center', marginBottom: 20, color: 'gray' }}>
        Sign in to your account
      </Text>

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Username</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 12,
          borderRadius: 8,
          marginBottom: 15,
        }}
        placeholder="Enter your username"
      />

      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Password</Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ddd',
            padding: 12,
            borderRadius: 8,
            marginBottom: 10,
            paddingRight: 40,
          }}
          placeholder="Enter your password"
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 10, top: 14 }}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={{ textAlign: 'right', color: '#7734eb', marginBottom: 20 }}>
          Forget Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: '#7734eb',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Sign In</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', marginTop: 20 }}>
        Don't have an account?{' '}
        <Text style={{ color: '#7734eb', fontWeight: 'bold' }}>Sign up</Text>
      </Text>
    </View>
  );
}
