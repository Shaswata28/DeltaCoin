import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useColorScheme,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { X, Scan, Flashlight, FlashlightOff, Zap, ZapOff } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
  Easing,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

export interface PaymentQRData {
  amount?: number;
  destination?: string;
  club?: string;
  description?: string;
  merchantId?: string;
  reference?: string;
}

export interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (data: PaymentQRData) => void;
  onScanError?: (error: string) => void;
  timeout?: number; // in milliseconds
  allowedFormats?: string[];
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate scan area size - make it smaller to ensure proper margins
const SCAN_AREA_SIZE = Math.min(screenWidth * 0.6, 240);

// Calculate positions for perfect centering with proper margins
const HEADER_HEIGHT = Platform.OS === 'ios' ? 140 : 120;
const FOOTER_HEIGHT = Platform.OS === 'ios' ? 140 : 120;
const AVAILABLE_HEIGHT = screenHeight - HEADER_HEIGHT - FOOTER_HEIGHT;
const SCAN_AREA_TOP = HEADER_HEIGHT + (AVAILABLE_HEIGHT - SCAN_AREA_SIZE) / 2;
const SCAN_AREA_LEFT = (screenWidth - SCAN_AREA_SIZE) / 2;

// Animation bounds - ensure scanning line stays within visible area
const SCAN_LINE_MARGIN = 12; // Margin from edges of scan area
const SCAN_LINE_TRAVEL_DISTANCE = SCAN_AREA_SIZE - (SCAN_LINE_MARGIN * 2);

export function QRScanner({
  visible,
  onClose,
  onScanSuccess,
  onScanError,
  timeout = 30000,
  allowedFormats = ['deltacoin']
}: QRScannerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  // Animation values
  const scanLinePosition = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const cornerOpacity = useSharedValue(0.8);
  const successScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      console.log('QRScanner: Scanner opened, allowed formats:', allowedFormats);
      
      // Request permission if not granted
      if (permission && !permission.granted) {
        requestPermission();
      }
      
      // Only start animations if we have permission
      if (permission?.granted) {
        // Start scanning animations with proper bounds
        scanLinePosition.value = withRepeat(
          withTiming(1, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
          -1,
          true
        );
        
        pulseScale.value = withRepeat(
          withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        );

        cornerOpacity.value = withRepeat(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        );

        // Set timeout for scanning session
        timeoutRef.current = setTimeout(() => {
          handleScanTimeout();
        }, timeout);
      }

      // Reset states
      setScanned(false);
      setIsProcessing(false);
      successScale.value = 0;
    } else {
      // Clear timeout when modal closes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, timeout, permission?.granted]);

  const handleScanTimeout = () => {
    console.log('QRScanner: Scan timeout reached');
    onScanError?.('Scanning session timed out. Please try again.');
    onClose();
  };

  const validateQRData = (data: string): PaymentQRData | null => {
    console.log('QRScanner: validateQRData input string:', data);

    if (!data || typeof data !== 'string') {
      console.log('QRScanner: Invalid data type or empty data');
      return null;
    }

    // Check for DeltaCoin format: deltacoin://pay?params
    if (data.startsWith('deltacoin://')) {
      console.log('QRScanner: Detected DeltaCoin format QR code');
      
      try {
        let urlToParse = data;
        
        if (data.startsWith('deltacoin://pay?')) {
          urlToParse = data.replace('deltacoin://pay?', 'deltacoin://pay/?');
          console.log('QRScanner: Restructured URL for parsing:', urlToParse);
        }
        
        const url = new URL(urlToParse);
        console.log('QRScanner: Parsed URL object:', {
          protocol: url.protocol,
          hostname: url.hostname,
          pathname: url.pathname,
          search: url.search
        });

        const isValidDeltaCoinURL = (
          url.protocol === 'deltacoin:' && 
          (url.hostname === 'pay' || (url.hostname === 'pay' && url.pathname === '/'))
        );

        if (!isValidDeltaCoinURL) {
          console.log('QRScanner: Invalid DeltaCoin URL structure');
          return null;
        }

        const params = new URLSearchParams(url.search);
        const paymentData: PaymentQRData = {};

        const amountStr = params.get('amount');
        if (amountStr) {
          const amount = parseFloat(amountStr);
          if (!isNaN(amount) && amount > 0) {
            paymentData.amount = amount;
          }
        }

        const destination = params.get('destination');
        if (destination) {
          const normalizedDestination = destination.charAt(0).toUpperCase() + destination.slice(1).toLowerCase();
          const validDestinations = ['Canteen', 'Library', 'Lab', 'Club', 'Other'];
          
          if (validDestinations.includes(normalizedDestination)) {
            paymentData.destination = normalizedDestination;
          }
        }

        const club = params.get('club');
        if (club) {
          paymentData.club = club.toLowerCase();
        }

        const description = params.get('description');
        if (description) {
          paymentData.description = decodeURIComponent(description);
        }

        const reference = params.get('reference');
        if (reference) {
          paymentData.reference = reference;
        }

        if (Object.keys(paymentData).length === 0) {
          console.log('QRScanner: No valid payment data extracted');
          return null;
        }

        return paymentData;
      } catch (error) {
        console.log('QRScanner: Error parsing DeltaCoin URL:', error);
        return null;
      }
    }

    console.log('QRScanner: No valid format detected');
    return null;
  };

  const sanitizePaymentData = (data: PaymentQRData): PaymentQRData => {
    const sanitized: PaymentQRData = {};

    if (data.amount !== undefined) {
      const amount = Number(data.amount);
      if (amount > 0 && amount <= 10000 && Number.isFinite(amount)) {
        sanitized.amount = Math.round(amount * 100) / 100;
      }
    }

    if (data.destination) {
      const destination = data.destination.toLowerCase().trim();
      const validDestinations = ['canteen', 'library', 'lab', 'club', 'other'];
      if (validDestinations.includes(destination)) {
        sanitized.destination = destination.charAt(0).toUpperCase() + destination.slice(1);
      }
    }

    if (data.club) {
      const club = data.club.toLowerCase().trim();
      const validClubs = ['photography', 'social', 'computer', 'sports', 'women empowerment', 'film & comedy'];
      if (validClubs.includes(club)) {
        sanitized.club = club;
      }
    }

    if (data.description) {
      sanitized.description = data.description
        .replace(/[<>]/g, '')
        .trim()
        .substring(0, 100);
    }

    if (data.merchantId) {
      sanitized.merchantId = data.merchantId
        .replace(/[^a-zA-Z0-9@._-]/g, '')
        .substring(0, 50);
    }
    
    return sanitized;
  };

  const triggerSuccessAnimation = () => {
    successScale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
  };

  const handleBarcodeScanned = ({ type, data }: BarcodeScanningResult) => {
    console.log('QRScanner: Raw barcode scanned data:', data);
    
    if (scanned || isProcessing) {
      return;
    }

    setScanned(true);
    setIsProcessing(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const paymentData = validateQRData(data);
    
    if (!paymentData) {
      setIsProcessing(false);
      setScanned(false);
      onScanError?.('Invalid QR code format. Please scan a DeltaCoin payment QR code.');
      return;
    }

    const sanitizedData = sanitizePaymentData(paymentData);

    if (Object.keys(sanitizedData).length === 0) {
      setIsProcessing(false);
      setScanned(false);
      onScanError?.('QR code contains invalid payment information.');
      return;
    }

    runOnJS(triggerSuccessAnimation)();

    setTimeout(() => {
      onScanSuccess(sanitizedData);
      onClose();
    }, 800);
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  // Animation styles with proper bounds
  const scanLineAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scanLinePosition.value,
            [0, 1],
            [SCAN_LINE_MARGIN, SCAN_LINE_MARGIN + SCAN_LINE_TRAVEL_DISTANCE]
          ),
        },
      ],
    };
  });

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  const cornerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cornerOpacity.value,
    };
  });

  const successAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: successScale.value }],
      opacity: successScale.value,
    };
  });



  // Render camera scanner UI
  const renderCameraScanner = () => (
    <CameraView
      style={styles.camera}
      facing="back"
      onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: ['qr'],
      }}
      enableTorch={flashEnabled}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={onClose}
          activeOpacity={0.7}
        >
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <Text style={styles.headerSubtitle}>DeltaCoin Payment</Text>
        </View>
        <TouchableOpacity 
          style={[styles.headerButton, flashEnabled && styles.headerButtonActive]} 
          onPress={toggleFlash}
          activeOpacity={0.7}
        >
          {flashEnabled ? (
            <ZapOff size={24} color="#FFD700" />
          ) : (
            <Zap size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Shadow Overlay - Full screen with square cutout */}
      <View style={styles.overlayContainer}>
        {/* Top shadow */}
        <View style={[styles.shadowSection, { height: SCAN_AREA_TOP }]} />
        
        {/* Middle row with left shadow, cutout, right shadow */}
        <View style={styles.middleRow}>
          <View style={[styles.shadowSection, { width: SCAN_AREA_LEFT }]} />
          <View style={styles.scanAreaCutout} />
          <View style={[styles.shadowSection, { width: SCAN_AREA_LEFT }]} />
        </View>
        
        {/* Bottom shadow */}
        <View style={[styles.shadowSection, { height: screenHeight - SCAN_AREA_TOP - SCAN_AREA_SIZE }]} />
      </View>

      {/* Scanner Frame - Positioned over the cutout */}
      <Animated.View style={[
        styles.scannerFrame,
        {
          top: SCAN_AREA_TOP,
          left: SCAN_AREA_LEFT,
          width: SCAN_AREA_SIZE,
          height: SCAN_AREA_SIZE,
        },
        pulseAnimatedStyle
      ]}>
        {/* Corner indicators */}
        <Animated.View style={[styles.corner, styles.topLeft, cornerAnimatedStyle]} />
        <Animated.View style={[styles.corner, styles.topRight, cornerAnimatedStyle]} />
        <Animated.View style={[styles.corner, styles.bottomLeft, cornerAnimatedStyle]} />
        <Animated.View style={[styles.corner, styles.bottomRight, cornerAnimatedStyle]} />
        
        {/* Scanning line with proper bounds */}
        <Animated.View style={[styles.scanLine, scanLineAnimatedStyle]} />
        
        {/* Success indicator */}
        <Animated.View style={[styles.successIndicator, successAnimatedStyle]}>
          <View style={styles.successIcon}>
            <Text style={styles.successText}>✓</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <View style={styles.instructionCard}>
          <Text style={styles.instructionText}>
            {isProcessing ? 'Processing QR Code...' : 'Position the QR code within the frame'}
          </Text>
          {!isProcessing && (
            <Text style={styles.instructionSubtext}>
              Make sure the code is well-lit and clearly visible
            </Text>
          )}
        </View>
      </View>
    </CameraView>
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.9)" />
      <View style={[styles.modalContainer, isDark && styles.modalContainerDark]}>
        {!permission ? (
          // Loading state
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
              Loading camera...
            </Text>
          </View>
        ) : (
          // Camera scanner UI - system will handle permission requests
          renderCameraScanner()
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  modalContainerDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.98)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  loadingTextDark: {
    color: '#A6A6A6',
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000, // Highest z-index
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 2,
  },
  
  // Overlay system - creates full screen shadow with square cutout
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Low z-index for overlay
  },
  shadowSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  middleRow: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  scanAreaCutout: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    backgroundColor: 'transparent', // Creates the cutout
  },
  
  // Scanner frame - positioned absolutely with high z-index
  scannerFrame: {
    position: 'absolute',
    zIndex: 100, // High z-index to appear above overlay
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#FFD700',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: 'absolute',
    left: SCAN_LINE_MARGIN,
    right: SCAN_LINE_MARGIN,
    height: 3,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 2,
  },
  successIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  successText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  instructions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
    zIndex: 500, // Medium z-index
  },
  instructionCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});