import 'package:flutter/material.dart';
import 'package:flutter_neumorphic/flutter_neumorphic.dart';

class NeumorphicInputField1 extends StatefulWidget {
  final TextEditingController textEditingController;
  final String hintText;
  final double bevel;
  final Offset blurOffset;
  final Color color;
  final EdgeInsets padding;
  NeumorphicInputField1({
    Key? key,
    required this.textEditingController,
    required this.hintText,
    this.bevel = 10.0,
    this.padding = const EdgeInsets.all(5.0),
  })  : blurOffset = Offset(bevel / 2, bevel / 2),
        color = const Color(0xffC43990),
        super(key: key);

  @override
  State<NeumorphicInputField1> createState() => _NeumorphicInputField1State();
}

class _NeumorphicInputField1State extends State<NeumorphicInputField1> {
  final bool isPressed = false;
  @override
  Widget build(BuildContext context) {
    final color = widget.color;
    return Listener(
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: widget.padding,
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(widget.bevel * 10),
            gradient: LinearGradient(
              colors: [Color(0xffFD5E3D), Color(0xffC43990)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight
            ) ,
            boxShadow: isPressed
                ? null
                : [
                    BoxShadow(
                      blurRadius: widget.bevel,
                      offset: -widget.blurOffset,
                      color: color.mix(Colors.white, .3),
                    ),
                    BoxShadow(
                        blurRadius: widget.bevel,
                        offset: widget.blurOffset,
                        color: color.mix(Colors.black, .3)),
                  ]),
        child: TextField(
          controller: widget.textEditingController,
          onChanged: (value) {},
          obscureText: true,
          style: const TextStyle(fontSize: 20, color:Color(0xffE6EED6)),
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.lock, color: Color(0xffE6EED6)),
            filled: true,
            hintText: widget.hintText,
            hintStyle: const TextStyle(color: Color(0xffE6EED6)),
            fillColor: Colors.transparent,
            contentPadding:
                const EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            errorBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            disabledBorder: InputBorder.none,
          ),
        ),
      ),
    );
  }
}

extension ColorUtils on Color {
  Color mix(Color another, double amount) {
    return Color.lerp(this, another, amount)!;
  }
}
