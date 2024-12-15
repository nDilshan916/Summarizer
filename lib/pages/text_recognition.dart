// import 'package:flutter/material.dart';
// import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
// import 'dart:io';
//
// class TextRecognitionPage extends StatefulWidget {
//   const TextRecognitionPage({super.key});
//
//   @override
//   _TextRecognitionPageState createState() => _TextRecognitionPageState();
// }
//
// class _TextRecognitionPageState extends State<TextRecognitionPage> {
//   String scannedText = "";
//
//   Future<void> performTextRecognition(File imageFile) async {
//     final inputImage = InputImage.fromFile(imageFile);
//     final textRecognizer = TextRecognizer();
//
//     try {
//       final RecognizedText recognizedText =
//       await textRecognizer.processImage(inputImage);
//
//       setState(() {
//         scannedText = recognizedText.text;
//       });
//     } catch (e) {
//       setState(() {
//         scannedText = "Error: ${e.toString()}";
//       });
//     } finally {
//       textRecognizer.close();
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text("Text Recognition")),
//       body: Column(
//         mainAxisAlignment: MainAxisAlignment.center,
//         children: [
//           ElevatedButton(
//             onPressed: () async {
//               // Pick an image (You can use ImagesPicker or any other library)
//             },
//             child: const Text("Select Image"),
//           ),
//           const SizedBox(height: 20),
//           Text(scannedText),
//         ],
//       ),
//     );
//   }
// }
