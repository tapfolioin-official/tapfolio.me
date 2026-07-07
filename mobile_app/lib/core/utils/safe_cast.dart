Map<String, dynamic>? asMap(dynamic item) {
  if (item == null) return null;
  if (item is Map) {
    try {
      return item.map((key, value) => MapEntry(key.toString(), value));
    } catch (_) {}
  }
  return null;
}

List<T> asList<T>(dynamic item, T Function(dynamic) mapper) {
  if (item == null || item is! List) return <T>[];
  return item.map((e) {
    try {
      return mapper(e);
    } catch (_) {
      return null;
    }
  }).whereType<T>().toList();
}
