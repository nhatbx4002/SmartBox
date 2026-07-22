from picamera2 import Picamera2
import cv2

picam2 = Picamera2()

config = picam2.create_preview_configuration(
    main={"size": (1280, 720)}
)

picam2.configure(config)
picam2.start()

detector = cv2.QRCodeDetector()

while True:
    frame = picam2.capture_array()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    data, points, _ = detector.detectAndDecode(gray)

    if points is not None:
        pts = points.astype(int)

        for i in range(len(pts[0])):
            pt1 = tuple(pts[0][i])
            pt2 = tuple(pts[0][(i + 1) % len(pts[0])])
            cv2.line(frame, pt1, pt2, (0, 255, 0), 2)

        if data:
            print("QR:", data)

            cv2.putText(
                frame,
                data,
                (10, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2,
            )

    cv2.imshow("QR Scanner", frame)

    key = cv2.waitKey(1)

    if key == ord("q"):
        break

cv2.destroyAllWindows()
picam2.stop()