enum CardTemplateStyle {
  minimal,
  glass,
  corporate,
  luxury,
  creative,
}

class CardTemplate {
  final String id;
  final String name;
  final CardTemplateStyle style;

  CardTemplate({
    required this.id,
    required this.name,
    required this.style,
  });
}
