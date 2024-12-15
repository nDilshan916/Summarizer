// import 'dart:io';
// import 'package:flutter/material.dart';
// import 'package:google_mlkit_document_scanner/google_mlkit_document_scanner.dart';
// import 'package:camera/camera.dart';
//
// class DocumentScannerPage extends StatefulWidget {
//   @override
//   _DocumentScannerPageState createState() => _DocumentScannerPageState();
// }
//
// class _DocumentScannerPageState extends State<DocumentScannerPage> {
//   CameraController? _cameraController;
//   File? _scannedDocument;
//   late List<CameraDescription> _cameras;
//
//   @override
//   void initState() {
//     super.initState();
//     initializeCamera();
//   }
//
//   // Initialize camera
//   Future<void> initializeCamera() async {
//     _cameras = await availableCameras();
//     _cameraController = CameraController(
//       _cameras[0],
//       ResolutionPreset.high,
//     );
//
//     await _cameraController?.initialize();
//     setState(() {});
//   }
//
//   Future<void> startDocumentScanner() async {
//     if (_cameraController == null || !_cameraController!.value.isInitialized) {
//       return;
//     }
//
//     try {
//       // Take a picture
//       final image = await _cameraController!.takePicture();
//       final documentScanner = DocumentScanner(
//         options: const DocumentScannerOptions(),
//       );
//
//       // Scan the captured image
//       final scannedDocuments = await documentScanner.processImage(File(image.path));
//       if (scannedDocuments != null && scannedDocuments.isNotEmpty) {
//         setState(() {
//           _scannedDocument = File(scannedDocuments.first.path);
//         });
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('Document scanned successfully')),
//         );
//       } else {
//         ScaffoldMessenger.of(context).showSnackBar(
//           const SnackBar(content: Text('No document detected')),
//         );
//       }
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(content: Text('Error scanning document: $e')),
//       );
//     }
//   }
//
//   @override
//   void dispose() {
//     _cameraController?.dispose();
//     super.dispose();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     if (_cameraController == null || !_cameraController!.value.isInitialized) {
//       return Scaffold(
//         appBar: AppBar(title: const Text("Document Scanner")),
//         body: const Center(child: CircularProgressIndicator()),
//       );
//     }
//
//     return Scaffold(
//       appBar: AppBar(title: const Text("Document Scanner")),
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             // Display camera preview
//             AspectRatio(
//               aspectRatio: _cameraController!.value.aspectRatio,
//               child: CameraPreview(_cameraController!),
//             ),
//             ElevatedButton(
//               onPressed: startDocumentScanner,
//               child: const Text("Scan Document"),
//             ),
//             if (_scannedDocument != null)
//               Column(
//                 children: [
//                   const SizedBox(height: 20),
//                   Image.file(_scannedDocument!),
//                 ],
//               ),
//           ],
//         ),
//       ),
//     );
//   }
// }
