
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
        primary: json['primary'] ?? '#6366F1',
        secondary: json['secondary'] ?? '#4F46E5',
        accent: json['accent'] ?? '#10B981',
        background: json['background'] ?? '#0A0A0F',
        surface: json['surface'] ?? '#1F2937',
        card: json['card'] ?? '#111827',
        text: json['text'] ?? '#FFFFFF',
        subtext: json['subtext'] ?? '#9CA3AF',
        border: json['border'] ?? '#374151',
        success: json['success'] ?? '#10B981',
        warning: json['warning'] ?? '#F59E0B',
        error: json['error'] ?? '#EF4444',
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
        type: json['type'] ?? 'solid',
        value: json['value'] ?? '#f0f2f8',
        brightness: (json['brightness'] as num?)?.toDouble() ?? 0.8,
        blur: (json['blur'] as num?)?.toDouble() ?? 0.0,
        overlayOpacity: (json['overlayOpacity'] as num?)?.toDouble() ?? 0.3,
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
        headingFont: json['headingFont'] ?? 'Outfit',
        bodyFont: json['bodyFont'] ?? 'Inter',
        weight: json['weight'] ?? '700',
        letterSpacing: (json['letterSpacing'] as num?)?.toDouble() ?? 0.0,
        lineHeight: (json['lineHeight'] as num?)?.toDouble() ?? 1.5,
        headingSize: (json['headingSize'] as num?)?.toDouble() ?? 28.0,
        bodySize: (json['bodySize'] as num?)?.toDouble() ?? 15.0,
        uppercase: json['uppercase'] ?? false,
        shadow: json['shadow'] ?? false,
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
        borderRadius: json['borderRadius'] ?? '16px',
        opacity: (json['opacity'] as num?)?.toDouble() ?? 1.0,
        blur: (json['blur'] as num?)?.toDouble() ?? 0.0,
        shadow: json['shadow'] ?? 'none',
        border: json['border'] ?? '1px solid rgba(255, 255, 255, 0.08)',
        padding: json['padding'] ?? '16px',
        spacing: json['spacing'] ?? '16px',
        elevation: (json['elevation'] as num?)?.toDouble() ?? 0.0,
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
        style: json['style'] ?? 'solid',
        radius: json['radius'] ?? '100px',
        height: json['height'] ?? '44px',
        shadow: json['shadow'] ?? 'none',
        border: json['border'] ?? 'none',
        padding: json['padding'] ?? '12px 24px',
        iconPosition: json['iconPosition'] ?? 'left',
        animation: json['animation'] ?? 'none',
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
        shape: json['shape'] ?? 'circle',
        border: json['border'] ?? '2px solid #6366F1',
        shadow: json['shadow'] ?? 'none',
        glow: json['glow'] ?? 'none',
        gradientBorder: json['gradientBorder'] ?? false,
        size: (json['size'] as num?)?.toDouble() ?? 80.0,
        alignment: json['alignment'] ?? 'center',
        animation: json['animation'] ?? 'none',
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
        style: json['style'] ?? 'default',
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
        style: json['style'] ?? 'fade',
        cursorGlow: json['cursorGlow'] ?? false,
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
    final rawOrder = json['order'] as List? ?? ['about', 'contact', 'socials', 'portfolio', 'projects'];
    final rawVisibility = json['visibility'] as Map? ?? {
      'about': true,
      'contact': true,
      'socials': true,
      'portfolio': true,
      'projects': true,
    };
    return SectionTheme(
      order: rawOrder.cast<String>(),
      visibility: Map<String, bool>.from(rawVisibility),
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
        glass: json['glass'] ?? false,
        noise: json['noise'] ?? false,
        gradientOverlay: json['gradientOverlay'] ?? false,
        glow: json['glow'] ?? false,
        blur: (json['blur'] as num?)?.toDouble() ?? 0.0,
        reflection: json['reflection'] ?? false,
        borderShine: json['borderShine'] ?? false,
        shadow: json['shadow'] ?? false,
        intensity: (json['intensity'] as num?)?.toDouble() ?? 0.5,
        speed: (json['speed'] as num?)?.toDouble() ?? 1.0,
        opacity: (json['opacity'] as num?)?.toDouble() ?? 1.0,
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

  factory ThemeSettings.fromJson(Map<String, dynamic> json) => ThemeSettings(
        colors: ColorTheme.fromJson(json['colors'] ?? {}),
        background: BackgroundTheme.fromJson(json['background'] ?? {}),
        typography: TypographyTheme.fromJson(json['typography'] ?? {}),
        cards: CardTheme.fromJson(json['cards'] ?? {}),
        buttons: ButtonTheme.fromJson(json['buttons'] ?? {}),
        avatar: AvatarTheme.fromJson(json['avatar'] ?? {}),
        layout: LayoutTheme.fromJson(json['layout'] ?? {}),
        animations: AnimationTheme.fromJson(json['animations'] ?? {}),
        sections: SectionTheme.fromJson(json['sections'] ?? {}),
        effects: EffectTheme.fromJson(json['effects'] ?? {}),
      );

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
