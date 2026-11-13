import os
import sys
import objc
from Foundation import NSURL
import Quartz
import Vision

def verify_qr_in_image(image_path, expected_url):
    print(f"Testing {os.path.basename(image_path)}...")
    if not os.path.exists(image_path):
        print(f"ERROR: File {image_path} does not exist!")
        return False

    url = NSURL.fileURLWithPath_(image_path)
    ci_image = Quartz.CIImage.imageWithContentsOfURL_(url)

    handler = Vision.VNImageRequestHandler.alloc().initWithCIImage_options_(ci_image, {})
    request = Vision.VNDetectBarcodesRequest.alloc().init()
    handler.performRequests_error_([request], None)

    results = request.results() or []
    if not results:
        print(f"FAILED: No QR code detected in {image_path}")
        return False

    for r in results:
        payload = r.payloadStringValue()
        confidence = r.confidence()
        print(f"Detected QR Code payload: '{payload}', confidence: {confidence}")
        if payload == expected_url:
            print(f"SUCCESS: Match for {image_path} (confidence {confidence})")
            return True
        else:
            print(f"MISMATCH: Expected '{expected_url}', got '{payload}'")

    return False

if __name__ == "__main__":
    test_img = "/tmp/tapfolio_test_exports/export_qr_painter.png"
    expected = "https://tapfolio.me/connect/nibras.in"
    res = verify_qr_in_image(test_img, expected)
    sys.exit(0 if res else 1)
