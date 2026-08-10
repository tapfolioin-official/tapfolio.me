
double _toDouble(dynamic val, double fallback) {
  if (val == null) return fallback;
  if (val is num) return val.toDouble();
  if (val is String) return double.tryParse(val) ?? fallback;
  return fallback;
}

int _toInt(dynamic val, int fallback) {
  if (val == null) return fallback;
  if (val is num) return val.toInt();
  if (val is String) return int.tryParse(val) ?? fallback;
  return fallback;
}

bool _toBool(dynamic val, bool fallback) {
  if (val == null) return fallback;
  if (val is bool) return val;
  if (val is String) {
    final lower = val.trim().toLowerCase();
    if (lower == 'true' || lower == '1') return true;
    if (lower == 'false' || lower == '0') return false;
  }
  if (val is num) return val != 0;
  return fallback;
}

String _toString(dynamic val, String fallback) {
  if (val == null) return fallback;
  if (val is String) return val;
  return val.toString();
}

// ─── ColorTheme ──────────────────────────────────────────────────────────────
class ColorTheme {
  final String primary;
  final String secondary;
  final String accent;
  final String background;
  final String surface;
  final String card;
  final String text;
  final String subtext;
  final String border;
  final String success;
  final String warning;
  final String error;

  ColorTheme({
    required this.primary,
    required this.secondary,
    required this.accent,
    required this.background,
    required this.surface,
    required this.card,
    required this.text,
    required this.subtext,
    required this.border,
    required this.success,
    required this.warning,
    required this.error,
  });

  factory ColorTheme.fromJson(Map<String, dynamic> json) => ColorTheme(
        primary: _toString(json['primary'], '#6366F1'),
        secondary: _toString(json['secondary'], '#4F46E5'),
        accent: _toString(json['accent'], '#10B981'),
        background: _toString(json['background'], '#0A0A0F'),
        surface: _toString(json['surface'], '#1F2937'),
        card: _toString(json['card'], '#111827'),
        text: _toString(json['text'], '#FFFFFF'),
        subtext: _toString(json['subtext'], '#9CA3AF'),
        border: _toString(json['border'], '#374151'),
        success: _toString(json['success'], '#10B981'),
        warning: _toString(json['warning'], '#F59E0B'),
        error: _toString(json['error'], '#EF4444'),
      );

  Map<String, dynamic> toJson() => {
        'primary': primary,
        'secondary': secondary,
        'accent': accent,
        'background': background,
        'surface': surface,
        'card': card,
        'text': text,
        'subtext': subtext,
        'border': border,
        'success': success,
        'warning': warning,
        'error': error,
      };

  ColorTheme copyWith({
    String? primary,
    String? secondary,
    String? accent,
    String? background,
    String? surface,
    String? card,
    String? text,
    String? subtext,
    String? border,
    String? success,
    String? warning,
    String? error,
  }) =>
      ColorTheme(
        primary: primary ?? this.primary,
        secondary: secondary ?? this.secondary,
        accent: accent ?? this.accent,
        background: background ?? this.background,
        surface: surface ?? this.surface,
        card: card ?? this.card,
        text: text ?? this.text,
        subtext: subtext ?? this.subtext,
        border: border ?? this.border,
        success: success ?? this.success,
        warning: warning ?? this.warning,
        error: error ?? this.error,
      );
}

// ─── BackgroundTheme ─────────────────────────────────────────────────────────
class BackgroundTheme {
  final String type; // solid, aurora, animated_gradient, particles, video, image
  final String value;
  final double brightness;
  final double blur;
  final double overlayOpacity;

  BackgroundTheme({
    required this.type,
    required this.value,
    required this.brightness,
    required this.blur,
    required this.overlayOpacity,
  });

  factory BackgroundTheme.fromJson(Map<String, dynamic> json) => BackgroundTheme(
        type: _toString(json['type'], 'solid'),
        value: _toString(json['value'], '#f0f2f8'),
        brightness: _toDouble(json['brightness'], 0.8),
        blur: _toDouble(json['blur'], 0.0),
        overlayOpacity: _toDouble(json['overlayOpacity'], 0.3),
      );

  Map<String, dynamic> toJson() => {
        'type': type,
        'value': value,
        'brightness': brightness,
        'blur': blur,
        'overlayOpacity': overlayOpacity,
      };

  BackgroundTheme copyWith({
    String? type,
    String? value,
    double? brightness,
    double? blur,
    double? overlayOpacity,
  }) =>
      BackgroundTheme(
        type: type ?? this.type,
        value: value ?? this.value,
        brightness: brightness ?? this.brightness,
        blur: blur ?? this.blur,
        overlayOpacity: overlayOpacity ?? this.overlayOpacity,
      );
}

// ─── TypographyTheme ─────────────────────────────────────────────────────────
class TypographyTheme {
  final String headingFont;
  final String bodyFont;
  final String weight;
  final double letterSpacing;
  final double lineHeight;
  final double headingSize;
  final double bodySize;
  final bool uppercase;
  final bool shadow;

  TypographyTheme({
    required this.headingFont,
    required this.bodyFont,
    required this.weight,
    required this.letterSpacing,
    required this.lineHeight,
    required this.headingSize,
    required this.bodySize,
    required this.uppercase,
    required this.shadow,
  });

  factory TypographyTheme.fromJson(Map<String, dynamic> json) => TypographyTheme(
        headingFont: _toString(json['headingFont'], 'Outfit'),
        bodyFont: _toString(json['bodyFont'], 'Inter'),
        weight: _toString(json['weight'], '700'),
        letterSpacing: _toDouble(json['letterSpacing'], 0.0),
        lineHeight: _toDouble(json['lineHeight'], 1.5),
        headingSize: _toDouble(json['headingSize'], 28.0),
        bodySize: _toDouble(json['bodySize'], 15.0),
        uppercase: _toBool(json['uppercase'], false),
        shadow: _toBool(json['shadow'], false),
      );

  Map<String, dynamic> toJson() => {
        'headingFont': headingFont,
        'bodyFont': bodyFont,
        'weight': weight,
        'letterSpacing': letterSpacing,
        'lineHeight': lineHeight,
        'headingSize': headingSize,
        'bodySize': bodySize,
        'uppercase': uppercase,
        'shadow': shadow,
      };

  TypographyTheme copyWith({
    String? headingFont,
    String? bodyFont,
    String? weight,
    double? letterSpacing,
    double? lineHeight,
    double? headingSize,
    double? bodySize,
    bool? uppercase,
    bool? shadow,
  }) =>
      TypographyTheme(
        headingFont: headingFont ?? this.headingFont,
        bodyFont: bodyFont ?? this.bodyFont,
        weight: weight ?? this.weight,
        letterSpacing: letterSpacing ?? this.letterSpacing,
        lineHeight: lineHeight ?? this.lineHeight,
        headingSize: headingSize ?? this.headingSize,
        bodySize: bodySize ?? this.bodySize,
        uppercase: uppercase ?? this.uppercase,
        shadow: shadow ?? this.shadow,
      );
}

// ─── CardTheme ───────────────────────────────────────────────────────────────
class CardTheme {
  final String borderRadius;
  final double opacity;
  final double blur;
  final String shadow;
  final String border;
  final String padding;
  final String spacing;
  final double elevation;

  CardTheme({
    required this.borderRadius,
    required this.opacity,
    required this.blur,
    required this.shadow,
    required this.border,
    required this.padding,
    required this.spacing,
    required this.elevation,
  });

  factory CardTheme.fromJson(Map<String, dynamic> json) => CardTheme(
        borderRadius: _toString(json['borderRadius'], '16px'),
        opacity: _toDouble(json['opacity'], 1.0),
        blur: _toDouble(json['blur'], 0.0),
        shadow: _toString(json['shadow'], 'none'),
        border: _toString(json['border'], '1px solid rgba(255, 255, 255, 0.08)'),
        padding: _toString(json['padding'], '16px'),
        spacing: _toString(json['spacing'], '16px'),
        elevation: _toDouble(json['elevation'], 0.0),
      );

  Map<String, dynamic> toJson() => {
        'borderRadius': borderRadius,
        'opacity': opacity,
        'blur': blur,
        'shadow': shadow,
        'border': border,
        'padding': padding,
        'spacing': spacing,
        'elevation': elevation,
      };

  CardTheme copyWith({
    String? borderRadius,
    double? opacity,
    double? blur,
    String? shadow,
    String? border,
    String? padding,
    String? spacing,
    double? elevation,
  }) =>
      CardTheme(
        borderRadius: borderRadius ?? this.borderRadius,
        opacity: opacity ?? this.opacity,
        blur: blur ?? this.blur,
        shadow: shadow ?? this.shadow,
        border: border ?? this.border,
        padding: padding ?? this.padding,
        spacing: spacing ?? this.spacing,
        elevation: elevation ?? this.elevation,
      );
}

// ─── ButtonTheme ─────────────────────────────────────────────────────────────
class ButtonTheme {
  final String style; // solid, outlined, ghost, gradient, pill
  final String radius;
  final String height;
  final String shadow;
  final String border;
  final String padding;
  final String iconPosition; // left, right
  final String animation; // ripple, scale, none

  ButtonTheme({
    required this.style,
    required this.radius,
    required this.height,
    required this.shadow,
    required this.border,
    required this.padding,
    required this.iconPosition,
    required this.animation,
  });

  factory ButtonTheme.fromJson(Map<String, dynamic> json) => ButtonTheme(
        style: _toString(json['style'], 'solid'),
        radius: _toString(json['radius'], '100px'),
        height: _toString(json['height'], '44px'),
        shadow: _toString(json['shadow'], 'none'),
        border: _toString(json['border'], 'none'),
        padding: _toString(json['padding'], '12px 24px'),
        iconPosition: _toString(json['iconPosition'], 'left'),
        animation: _toString(json['animation'], 'none'),
      );

  Map<String, dynamic> toJson() => {
        'style': style,
        'radius': radius,
        'height': height,
        'shadow': shadow,
        'border': border,
        'padding': padding,
        'iconPosition': iconPosition,
        'animation': animation,
      };

  ButtonTheme copyWith({
    String? style,
    String? radius,
    String? height,
    String? shadow,
    String? border,
    String? padding,
    String? iconPosition,
    String? animation,
  }) =>
      ButtonTheme(
        style: style ?? this.style,
        radius: radius ?? this.radius,
        height: height ?? this.height,
        shadow: shadow ?? this.shadow,
        border: border ?? this.border,
        padding: padding ?? this.padding,
        iconPosition: iconPosition ?? this.iconPosition,
        animation: animation ?? this.animation,
      );
}

// ─── AvatarTheme ─────────────────────────────────────────────────────────────
class AvatarTheme {
  final String shape; // circle, rounded, square
  final String border;
  final String shadow;
  final String glow;
  final bool gradientBorder;
  final double size;
  final String alignment; // left, center, right
  final String animation; // pulse, rotating_ring, glow_ring, none

  AvatarTheme({
    required this.shape,
    required this.border,
    required this.shadow,
    required this.glow,
    required this.gradientBorder,
    required this.size,
    required this.alignment,
    required this.animation,
  });

  factory AvatarTheme.fromJson(Map<String, dynamic> json) => AvatarTheme(
        shape: _toString(json['shape'], 'circle'),
        border: _toString(json['border'], '2px solid #6366F1'),
        shadow: _toString(json['shadow'], 'none'),
        glow: _toString(json['glow'], 'none'),
        gradientBorder: _toBool(json['gradientBorder'], false),
        size: _toDouble(json['size'], 80.0),
        alignment: _toString(json['alignment'], 'center'),
        animation: _toString(json['animation'], 'none'),
      );

  Map<String, dynamic> toJson() => {
        'shape': shape,
        'border': border,
        'shadow': shadow,
        'glow': glow,
        'gradientBorder': gradientBorder,
        'size': size,
        'alignment': alignment,
        'animation': animation,
      };

  AvatarTheme copyWith({
    String? shape,
    String? border,
    String? shadow,
    String? glow,
    bool? gradientBorder,
    double? size,
    String? alignment,
    String? animation,
  }) =>
      AvatarTheme(
        shape: shape ?? this.shape,
        border: border ?? this.border,
        shadow: shadow ?? this.shadow,
        glow: glow ?? this.glow,
        gradientBorder: gradientBorder ?? this.gradientBorder,
        size: size ?? this.size,
        alignment: alignment ?? this.alignment,
        animation: animation ?? this.animation,
      );
}

// ─── LayoutTheme ─────────────────────────────────────────────────────────────
class LayoutTheme {
  final String style; // default, minimal, compact, business, creative

  LayoutTheme({
    required this.style,
  });

  factory LayoutTheme.fromJson(Map<String, dynamic> json) => LayoutTheme(
        style: _toString(json['style'], 'default'),
      );

  Map<String, dynamic> toJson() => {
        'style': style,
      };

  LayoutTheme copyWith({
    String? style,
  }) =>
      LayoutTheme(
        style: style ?? this.style,
      );
}

// ─── AnimationTheme ──────────────────────────────────────────────────────────
class AnimationTheme {
  final String style; // fade, slide, scale, none
  final bool cursorGlow;

  AnimationTheme({
    required this.style,
    required this.cursorGlow,
  });

  factory AnimationTheme.fromJson(Map<String, dynamic> json) => AnimationTheme(
        style: _toString(json['style'], 'fade'),
        cursorGlow: _toBool(json['cursorGlow'], false),
      );

  Map<String, dynamic> toJson() => {
        'style': style,
        'cursorGlow': cursorGlow,
      };

  AnimationTheme copyWith({
    String? style,
    bool? cursorGlow,
  }) =>
      AnimationTheme(
        style: style ?? this.style,
        cursorGlow: cursorGlow ?? this.cursorGlow,
      );
}

// ─── SectionTheme ────────────────────────────────────────────────────────────
class SectionTheme {
  final List<String> order;
  final Map<String, bool> visibility;

  SectionTheme({
    required this.order,
    required this.visibility,
  });

  factory SectionTheme.fromJson(Map<String, dynamic> json) {
    List<String> orderList = ['about', 'contact', 'socials', 'portfolio', 'projects'];
    if (json['order'] is List) {
      orderList = (json['order'] as List).map((e) => e.toString()).toList();
    }
    
    final Map<String, bool> visMap = {
      'about': true,
      'contact': true,
      'socials': true,
      'portfolio': true,
      'projects': true,
    };
    
    if (json['visibility'] is Map) {
      (json['visibility'] as Map).forEach((k, v) {
        visMap[k.toString()] = _toBool(v, true);
      });
    }

    return SectionTheme(
      order: orderList,
      visibility: visMap,
    );
  }

  Map<String, dynamic> toJson() => {
        'order': order,
        'visibility': visibility,
      };

  SectionTheme copyWith({
    List<String>? order,
    Map<String, bool>? visibility,
  }) =>
      SectionTheme(
        order: order ?? this.order,
        visibility: visibility ?? this.visibility,
      );
}

// ─── EffectTheme ─────────────────────────────────────────────────────────────
class EffectTheme {
  final bool glass;
  final bool noise;
  final bool gradientOverlay;
  final bool glow;
  final double blur;
  final bool reflection;
  final bool borderShine;
  final bool shadow;
  final double intensity;
  final double speed;
  final double opacity;

  EffectTheme({
    required this.glass,
    required this.noise,
    required this.gradientOverlay,
    required this.glow,
    required this.blur,
    required this.reflection,
    required this.borderShine,
    required this.shadow,
    required this.intensity,
    required this.speed,
    required this.opacity,
  });

  factory EffectTheme.fromJson(Map<String, dynamic> json) => EffectTheme(
        glass: _toBool(json['glass'], false),
        noise: _toBool(json['noise'], false),
        gradientOverlay: _toBool(json['gradientOverlay'], false),
        glow: _toBool(json['glow'], false),
        blur: _toDouble(json['blur'], 0.0),
        reflection: _toBool(json['reflection'], false),
        borderShine: _toBool(json['borderShine'], false),
        shadow: _toBool(json['shadow'], false),
        intensity: _toDouble(json['intensity'], 0.5),
        speed: _toDouble(json['speed'], 1.0),
        opacity: _toDouble(json['opacity'], 1.0),
      );

  Map<String, dynamic> toJson() => {
        'glass': glass,
        'noise': noise,
        'gradientOverlay': gradientOverlay,
        'glow': glow,
        'blur': blur,
        'reflection': reflection,
        'borderShine': borderShine,
        'shadow': shadow,
        'intensity': intensity,
        'speed': speed,
        'opacity': opacity,
      };

  EffectTheme copyWith({
    bool? glass,
    bool? noise,
    bool? gradientOverlay,
    bool? glow,
    double? blur,
    bool? reflection,
    bool? borderShine,
    bool? shadow,
    double? intensity,
    double? speed,
    double? opacity,
  }) =>
      EffectTheme(
        glass: glass ?? this.glass,
        noise: noise ?? this.noise,
        gradientOverlay: gradientOverlay ?? this.gradientOverlay,
        glow: glow ?? this.glow,
        blur: blur ?? this.blur,
        reflection: reflection ?? this.reflection,
        borderShine: borderShine ?? this.borderShine,
        shadow: shadow ?? this.shadow,
        intensity: intensity ?? this.intensity,
        speed: speed ?? this.speed,
        opacity: opacity ?? this.opacity,
      );
}

// ─── ThemeSettings (Root Aggregator) ─────────────────────────────────────────
class ThemeSettings {
  final ColorTheme colors;
  final BackgroundTheme background;
  final TypographyTheme typography;
  final CardTheme cards;
  final ButtonTheme buttons;
  final AvatarTheme avatar;
  final LayoutTheme layout;
  final AnimationTheme animations;
  final SectionTheme sections;
  final EffectTheme effects;

  ThemeSettings({
    required this.colors,
    required this.background,
    required this.typography,
    required this.cards,
    required this.buttons,
    required this.avatar,
    required this.layout,
    required this.animations,
    required this.sections,
    required this.effects,
  });

  factory ThemeSettings.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> getMap(String key) {
      final val = json[key];
      if (val is Map) return Map<String, dynamic>.from(val);
      return {};
    }

    return ThemeSettings(
      colors: ColorTheme.fromJson(getMap('colors')),
      background: BackgroundTheme.fromJson(getMap('background')),
      typography: TypographyTheme.fromJson(getMap('typography')),
      cards: CardTheme.fromJson(getMap('cards')),
      buttons: ButtonTheme.fromJson(getMap('buttons')),
      avatar: AvatarTheme.fromJson(getMap('avatar')),
      layout: LayoutTheme.fromJson(getMap('layout')),
      animations: AnimationTheme.fromJson(getMap('animations')),
      sections: SectionTheme.fromJson(getMap('sections')),
      effects: EffectTheme.fromJson(getMap('effects')),
    );
  }

  Map<String, dynamic> toJson() => {
        'colors': colors.toJson(),
        'background': background.toJson(),
        'typography': typography.toJson(),
        'cards': cards.toJson(),
        'buttons': buttons.toJson(),
        'avatar': avatar.toJson(),
        'layout': layout.toJson(),
        'animations': animations.toJson(),
        'sections': sections.toJson(),
        'effects': effects.toJson(),
      };

  ThemeSettings copyWith({
    ColorTheme? colors,
    BackgroundTheme? background,
    TypographyTheme? typography,
    CardTheme? cards,
    ButtonTheme? buttons,
    AvatarTheme? avatar,
    LayoutTheme? layout,
    AnimationTheme? animations,
    SectionTheme? sections,
    EffectTheme? effects,
  }) =>
      ThemeSettings(
        colors: colors ?? this.colors,
        background: background ?? this.background,
        typography: typography ?? this.typography,
        cards: cards ?? this.cards,
        buttons: buttons ?? this.buttons,
        avatar: avatar ?? this.avatar,
        layout: layout ?? this.layout,
        animations: animations ?? this.animations,
        sections: sections ?? this.sections,
        effects: effects ?? this.effects,
      );

  static ThemeSettings defaultValue() => ThemeSettings(
        colors: ColorTheme.fromJson({}),
        background: BackgroundTheme.fromJson({}),
        typography: TypographyTheme.fromJson({}),
        cards: CardTheme.fromJson({}),
        buttons: ButtonTheme.fromJson({}),
        avatar: AvatarTheme.fromJson({}),
        layout: LayoutTheme.fromJson({}),
        animations: AnimationTheme.fromJson({}),
        sections: SectionTheme.fromJson({}),
        effects: EffectTheme.fromJson({}),
      );
}
