import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:file_picker/file_picker.dart';
import "package:images_picker/images_picker.dart";

class Homepage extends StatefulWidget {
  static const String id = 'Homepage';
  const Homepage({super.key});

  @override
  State<Homepage> createState() => _HomepageState();
}

class _HomepageState extends State<Homepage> {
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose(); // Dispose controller to free resources
    super.dispose();
  }

  String _inputText = "";
  double _sliderValue = 0.0;

  int getWordCount(String text) {
    if (text.isEmpty) return 0;
    return text.trim().split(RegExp(r'\s+')).length;
  }

  Future<void> browseFiles() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      String? filePath = result.files.single.path;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Selected file: $filePath')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('File selection canceled')),
      );
    }
  }
  Future getImage() async {
    List<Media>? res = await ImagesPicker.pick(
      count: 3,
      pickType: PickType.image,
    );
// Media
// .path
// .thumbPath (path for video thumb)
// .size (kb)
  }

  Future openCamera() async {
    List<Media>? res = await ImagesPicker.openCamera(
      pickType: PickType.video,
      maxTime: 15, // record video max time
    );
// Media
// .path
// .thumbPath (path for video thumb)
// .size (kb)
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Summarizer',
          style: TextStyle(color: Colors.white),
        ),
        centerTitle: true,
        backgroundColor: Colors.black26,
      ),
      backgroundColor: Colors.blueGrey,
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  'Enter Your Text Below:',
                  style: TextStyle(fontSize: 20, color: Colors.white),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Container(
              height: 200,
              decoration: const BoxDecoration(
                color: Colors.white,
                // border: Border.all(color: Colors.black26),
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(15),
                    topRight: Radius.circular(15)),
              ),
              child: Stack(
                children: [
                  TextField(
                    controller: _controller,
                    maxLines: null,
                    keyboardType: TextInputType.multiline,
                    decoration: const InputDecoration(
                      // labelText: 'Your Input',
                      hintText: 'Type something here...',
                      border: InputBorder.none,
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    onChanged: (text) {
                      setState(() {
                        _inputText = text;
                      });
                    },
                  ),
                  Positioned(
                    bottom: 8,
                    right: 12,
                    child: Text(
                      '${getWordCount(_inputText)} words',
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.grey,
                      ),
                    ),
                  )
                ],
              ),
            ),
            Container(
              decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(15),
                      bottomRight: Radius.circular(15))),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Slider(
                    value: _sliderValue,
                    overlayColor: WidgetStatePropertyAll(Colors.black54),
                    thumbColor: Colors.black,
                    activeColor: Colors.black,
                    secondaryActiveColor: Colors.black54,
                    min: 0.0,
                    max: 100.0,
                    divisions: 100,
                    // label: _sliderValue.round().toString(),
                    onChanged: (double value) {
                      setState(() {
                        _sliderValue = value;
                      });
                    },
                  ),
                  Text(
                    "${_sliderValue.round()}%",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  )
                ],
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: 250,
              height: 45,
              child: ElevatedButton(
                style: const ButtonStyle(
                  backgroundColor: WidgetStatePropertyAll(Colors.white60),
                  // minimumSize: WidgetStatePropertyAll(Size(200, 40)),
                ),
                onPressed: () {
                  final inputText = _controller.text;
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('You entered: $inputText')),
                  );
                },
                child: const Text(
                  'Summary',
                  style: TextStyle(color: Colors.black, fontSize: 20),
                ),
              ),
            ),
            const SizedBox(
              height: 30,
            ),
            Container(
              height: 250,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      CustomCard(
                        onTap: browseFiles,
                        icon: Icon(Icons.camera_alt_outlined),
                        text: "Camera",
                      ),
                      SizedBox(
                        width: 10,
                      ),
                      CustomCard(
                          onTap: browseFiles,
                          icon: Icon(Icons.file_copy_sharp),
                          text: "Files"),
                    ],
                  ),
                  // SizedBox(height: 30,),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      CustomCard(
                          onTap: getImage,
                          icon: Icon(FontAwesomeIcons.image),
                          text: "Gallery")
                    ],
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}

class CustomCard extends StatelessWidget {
  const CustomCard({
    super.key,
    required this.icon,
    required this.text,
    required this.onTap,
  });

  final Icon icon;
  final String text;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 100,
        decoration: BoxDecoration(
            border: Border.all(color: Colors.black54),
            borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              icon,
              const SizedBox(
                width: 12,
              ),
              Text(text),
            ],
          ),
        ),
      ),
    );
  }
}
