// page-ocr.swift: a page image's text with positions, by macOS's Vision (macOS 15 or later; vertical Japanese is read).
// JSON on stdout: { w, h, lines: [{ box: [x0, y0, x1, y1], text, conf, chars: [[x0, y0, x1, y1] | null, …] }] },
// boxes in the image's pixels, y down; chars one to each character of text.
//   swift page-ocr.swift image [lang]        lang: ja-JP if not given
import Foundation
import Vision
import ImageIO

let args = CommandLine.arguments
guard args.count > 1 else { FileHandle.standardError.write("usage: swift page-ocr.swift image [lang]\n".data(using: .utf8)!); exit(1) }
let url = URL(fileURLWithPath: args[1])
guard let src = CGImageSourceCreateWithURL(url as CFURL, nil), let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
  FileHandle.standardError.write("cannot read \(args[1])\n".data(using: .utf8)!); exit(1)
}
let W = Double(cg.width), H = Double(cg.height)
var req = RecognizeTextRequest()
req.recognitionLevel = .accurate
req.recognitionLanguages = [Locale.Language(identifier: args.count > 2 ? args[2] : "ja-JP")]
req.automaticallyDetectsLanguage = false
req.usesLanguageCorrection = false
let obs = try await req.perform(on: cg)
func px(_ r: NormalizedRect) -> [Double] {
  let c = r.cgRect   // origin at the lower left, shares of the image
  return [(c.minX * W).rounded(), ((1 - c.maxY) * H).rounded(), (c.maxX * W).rounded(), ((1 - c.minY) * H).rounded()]
}
var lines: [[String: Any]] = []
for o in obs {
  guard let c = o.topCandidates(1).first else { continue }
  let s = c.string
  var chars: [Any] = []
  var i = s.startIndex
  while i < s.endIndex {
    let j = s.index(after: i)
    if let b = c.boundingBox(for: i..<j) { chars.append(px(b.boundingBox)) } else { chars.append(NSNull()) }
    i = j
  }
  lines.append(["box": px(o.boundingBox), "text": s, "conf": Double(c.confidence), "chars": chars])
}
let data = try JSONSerialization.data(withJSONObject: ["w": W, "h": H, "lines": lines], options: [])
FileHandle.standardOutput.write(data)
