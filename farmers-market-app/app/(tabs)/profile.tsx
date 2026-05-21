import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';

const APP_VERSION = '1.0.0';

type AuthMode = 'signin' | 'signup' | null;

// ─── Auth Modal ───────────────────────────────────────────────────────────────

function AuthModal({ mode, onClose }: { mode: AuthMode; onClose: () => void }) {
  const { signIn } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    if (mode === 'signup' && !password.trim()) {
      Alert.alert('Missing info', 'Please enter a password.');
      return;
    }
    signIn(name.trim(), email.trim());
    onClose();
  };

  const isSignIn = mode === 'signin';

  return (
    <Modal
      visible={!!mode}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={modal.safe} edges={['top', 'bottom']}>
        <View style={modal.header}>
          <TouchableOpacity onPress={onClose} style={modal.closeBtn}>
            <Ionicons name="close" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <Text style={modal.title}>{isSignIn ? 'Sign In' : 'Create Account'}</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView contentContainerStyle={modal.content} keyboardShouldPersistTaps="handled">
          <Image
            source={require('../../assets/Shefa Wordmark (no background).png')}
            style={modal.wordmark}
            resizeMode="contain"
          />
          <Text style={modal.subtitle}>
            {isSignIn ? 'Welcome back to Shefa' : 'Join Shefa and start pre-ordering'}
          </Text>
          <View style={modal.form}>
            <View style={modal.inputGroup}>
              <Text style={modal.label}>Full Name</Text>
              <TextInput
                style={modal.input}
                placeholder="Jane Smith"
                placeholderTextColor={Colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            <View style={modal.inputGroup}>
              <Text style={modal.label}>Email</Text>
              <TextInput
                style={modal.input}
                placeholder="jane@example.com"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {!isSignIn && (
              <View style={modal.inputGroup}>
                <Text style={modal.label}>Password</Text>
                <TextInput
                  style={modal.input}
                  placeholder="Create a password"
                  placeholderTextColor={Colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            )}
            <Button
              label={isSignIn ? 'Sign In' : 'Create Account'}
              size="lg"
              onPress={handleSubmit}
              style={{ marginTop: 8 }}
            />
            <Text style={modal.disclaimer}>
              {isSignIn ? 'Demo mode — no real authentication' : 'Demo mode — password not stored'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Settings Row ─────────────────────────────────────────────────────────────

interface SettingsRowProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  onPress: () => void;
  isLast?: boolean;
}

function SettingsRow({ icon, iconColor, iconBg, label, onPress, isLast }: SettingsRowProps) {
  return (
    <TouchableOpacity
      style={[row.container, !isLast && row.border]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[row.iconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <Text style={row.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const [authMode, setAuthMode] = useState<AuthMode>(null);

  const firstInitial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

  // ── Logged-out state ──────────────────────────────────────────
  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Image
            source={require('../../assets/Shefa lettermark logo (S) (no background).png')}
            style={styles.lettermark}
            resizeMode="contain"
          />
        </View>

        <View style={styles.loggedOutContainer}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={Colors.textSecondary} />
          </View>
          <Text style={styles.loggedOutHeading}>Sign in to track your orders</Text>
          <Text style={styles.loggedOutSub}>
            Pre-order from your favourite vendors and pick up at the market.
          </Text>
          <Button
            label="Sign In"
            size="lg"
            onPress={() => setAuthMode('signin')}
            style={styles.authBtn}
          />
          <Button
            label="Create Account"
            size="lg"
            variant="outline"
            onPress={() => setAuthMode('signup')}
            style={styles.authBtn}
          />
        </View>

        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      </SafeAreaView>
    );
  }

  // ── Logged-in state ───────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Image
          source={require('../../assets/Shefa lettermark logo (S) (no background).png')}
          style={styles.lettermark}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Avatar + user info */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{firstInitial}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>Member since today</Text>
        </View>

        {/* Section: Account */}
        <Text style={styles.sectionHeader}>Account</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon="receipt-outline"
            iconColor="#456F41"
            iconBg="#EAF2E9"
            label="Order History"
            onPress={() => Alert.alert('Order History', '3 recent orders (demo)')}
          />
          <SettingsRow
            icon="heart-outline"
            iconColor="#E74C3C"
            iconBg="#FDECEA"
            label="Saved Vendors"
            onPress={() => Alert.alert('Saved Vendors', '5 saved vendors (demo)')}
          />
          <SettingsRow
            icon="card-outline"
            iconColor="#2980B9"
            iconBg="#EBF5FB"
            label="Payment Methods"
            onPress={() => Alert.alert('Payment Methods', 'Visa ••••4242 (demo)')}
            isLast
          />
        </View>

        {/* Section: Preferences */}
        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon="notifications-outline"
            iconColor="#E67E22"
            iconBg="#FEF9E7"
            label="Notification Settings"
            onPress={() => Alert.alert('Notifications', 'Market day reminders: ON (demo)')}
          />
          <SettingsRow
            icon="leaf-outline"
            iconColor="#27AE60"
            iconBg="#EAFAF1"
            label="Dietary Preferences"
            onPress={() => Alert.alert('Dietary Preferences', 'Vegan, Gluten-free (demo)')}
          />
          <SettingsRow
            icon="map-outline"
            iconColor="#8E44AD"
            iconBg="#F5EEF8"
            label="My Markets"
            onPress={() => Alert.alert('My Markets', 'Barton Creek, Mueller (demo)')}
            isLast
          />
        </View>

        {/* Section: General */}
        <Text style={styles.sectionHeader}>General</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon="person-outline"
            iconColor="#456F41"
            iconBg="#EAF2E9"
            label="Personal Information"
            onPress={() => Alert.alert('Personal Information', 'Edit name/email (demo)')}
          />
          <SettingsRow
            icon="shield-outline"
            iconColor="#2C3E50"
            iconBg="#EAECEE"
            label="Privacy & Security"
            onPress={() => Alert.alert('Privacy & Security', 'Demo mode')}
          />
          <SettingsRow
            icon="help-circle-outline"
            iconColor="#2980B9"
            iconBg="#EBF5FB"
            label="Help & Support"
            onPress={() => Alert.alert('Help & Support', 'support@shefa.app')}
          />
          <SettingsRow
            icon="information-circle-outline"
            iconColor="#7F8C8D"
            iconBg="#F2F3F4"
            label="About Shefa"
            onPress={() => Alert.alert('About Shefa', `Shefa v${APP_VERSION} · Farmers Market Pre-ordering`)}
            isLast
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut} activeOpacity={0.8}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primaryGreen,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 24, color: Colors.white },
  lettermark: { width: 32, height: 32 },
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 32 },

  // Logged out
  loggedOutContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  loggedOutHeading: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 26,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  loggedOutSub: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  authBtn: { width: '100%' },

  // User card
  userCard: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    marginBottom: 24,
    gap: 4,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarInitial: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 36,
    color: Colors.white,
  },
  userName: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 26,
    color: Colors.textPrimary,
  },
  userEmail: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  memberSince: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  // Settings
  sectionHeader: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 13,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 20,
  },

  // Sign out
  signOutBtn: {
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 15,
    color: Colors.error,
  },
});

const row = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 14,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 15,
    color: Colors.textPrimary,
  },
});

const modal = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  wordmark: {
    width: 140,
    height: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
  },
  form: {
    width: '100%',
    gap: 14,
  },
  inputGroup: { gap: 6 },
  label: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 13,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Outfit_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  disclaimer: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
