import AppKit
import Foundation

guard CommandLine.arguments.count == 5 else {
  fatalError("Uso: swift generate-android-icon-layers.swift <mascot.png> <foreground.png> <background.png> <monochrome.png>")
}

let input = URL(fileURLWithPath: CommandLine.arguments[1])
let foreground = URL(fileURLWithPath: CommandLine.arguments[2])
let background = URL(fileURLWithPath: CommandLine.arguments[3])
let monochrome = URL(fileURLWithPath: CommandLine.arguments[4])

guard let source = NSImage(contentsOf: input) else {
  fatalError("Não foi possível abrir o mascote")
}

func write(_ image: NSImage, to url: URL) throws {
  guard let data = image.tiffRepresentation,
        let bitmap = NSBitmapImageRep(data: data),
        let png = bitmap.representation(using: .png, properties: [:]) else {
    throw CocoaError(.fileWriteUnknown)
  }
  try png.write(to: url)
}

func transparentLayer(canvas: CGFloat, subject: CGFloat, monochrome: Bool) -> NSImage {
  let image = NSImage(size: NSSize(width: canvas, height: canvas))
  image.lockFocus()
  let rect = NSRect(x: (canvas - subject) / 2, y: (canvas - subject) / 2, width: subject, height: subject)
  if monochrome {
    source.draw(in: rect, from: .zero, operation: .sourceOver, fraction: 1)
    let context = NSGraphicsContext.current!.cgContext
    context.setBlendMode(.sourceIn)
    context.setFillColor(NSColor.black.cgColor)
    context.fill(rect)
    context.setBlendMode(.normal)
  } else {
    source.draw(in: rect, from: .zero, operation: .sourceOver, fraction: 1)
  }
  image.unlockFocus()
  return image
}

let backgroundImage = NSImage(size: NSSize(width: 512, height: 512))
backgroundImage.lockFocus()
NSColor(calibratedRed: 230 / 255, green: 244 / 255, blue: 254 / 255, alpha: 1).setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: 512, height: 512)).fill()
backgroundImage.unlockFocus()

try write(transparentLayer(canvas: 512, subject: 340, monochrome: false), to: foreground)
try write(backgroundImage, to: background)
try write(transparentLayer(canvas: 432, subject: 288, monochrome: true), to: monochrome)
