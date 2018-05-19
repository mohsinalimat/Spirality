//
//  XYCircleDrawCanvas.swift
//  CircleDrawer
//
//  Created by XcodeYang on 22/11/2017.
//  Copyright © 2017 XcodeYang. All rights reserved.
//

import UIKit

private let FirstPreLoadImageKey = "had_been_lanuch_app"

class SpiralityCanvas: UIView {
    
    @IBInspectable var numberOfDrawer: Int = 30 {
        didSet {
            prepareNewLayers()
        }
    };
    @IBInspectable var lineWidth: CGFloat = 1/UIScreen.main.scale {
        didSet {
            prepareNewLayers()
        }
    }
    @IBInspectable var drawColor: UIColor = UIColor.white {
        didSet {
            prepareNewLayers()
        }
    }
    
    var penStyle = PenStyle.pencil {
        didSet {
            delegate?.penTypeButton.isSelected = penStyle == .bucket
            prepareNewLayers()
        }
    }
    
    weak var delegate: OverlayerView?
    var isValide = false
    var startTime = 0.0
    var stack = SpiralityStack()
    var item: SpiralityDrawRecordItem?
    
    lazy private var imageLayer: CALayer? = {
        var firstLoadImage: UIImage!
        if UserDefaults.standard.bool(forKey: FirstPreLoadImageKey) {
            return nil
        } else {
            firstLoadImage = UIImage(named: "default_load.jpeg")
        }
        let imageLayer = CALayer()
        imageLayer.contents = firstLoadImage.cgImage
        imageLayer.frame.size = CGSize(width: firstLoadImage.size.width/UIScreen.main.scale, height: firstLoadImage.size.height/UIScreen.main.scale)
        layer.insertSublayer(imageLayer, at: 0)
        return imageLayer
    }()
    
    private func prepareNewLayers() {
        item = SpiralityDrawRecordItem()
        item?.color = drawColor
        item?.linWidth = lineWidth
        item?.penStyle = penStyle
        item?.updateCollects(num: numberOfDrawer)
    }
    
    func play() {
        stack.playAnimation()
    }
}


extension SpiralityCanvas {
    
    override func layoutSubviews() {
        guard let imageLayer = imageLayer else { return }
        imageLayer.frame.origin = CGPoint(x: (frame.width-imageLayer.frame.width)/2.0, y: (frame.height-imageLayer.frame.height)/2.0)
    }
    
    override func didMoveToWindow() {
        self.backgroundColor = UIColor.black
        self.prepareNewLayers()
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        isValide = false
        startTime = NSDate().timeIntervalSince1970
        
        UIView.animate(withDuration: 0.2) {
            self.delegate?.alpha = 0;
        }
        item?.layers.forEach{ layer.addSublayer($0) }
        
        guard let point = touches.first?.location(in: self) else { return; }
        item?.paths.enumerated().forEach { (index, pathLayer) in
            pathLayer.move(to: convertPointByCenterOfPoint(point: point, index: index))
        }
    }
    
    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        isValide = true
        guard let point = touches.first?.location(in: self) else { return; }
        
        item?.paths.enumerated().forEach { (index, path) in
            path.addLine(to: convertPointByCenterOfPoint(point: point, index: index))
        }
        
        if penStyle == PenStyle.bucket {
            item?.layers.enumerated().forEach({ (pathIndex, pathLayer) in
                let newPath = item?.paths[pathIndex].mutableCopy()
                newPath?.closeSubpath()
                pathLayer.path = newPath
            })
        } else {
            item?.layers.enumerated().forEach({ (pathIndex, pathLayer) in
                pathLayer.path = item?.paths[pathIndex]
            })
        }
    }
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        UIView.animate(withDuration: 0.2) {
            self.delegate?.alpha = 1;
        }
        if isValide {
            item?.duration = NSDate().timeIntervalSince1970 - startTime
            stack.push(item: item)
            prepareNewLayers()
            delegate?.gobackBtn.isEnabled = true
            delegate?.goForwardBtn.isEnabled = false
        } else {
            item?.layers.forEach{ $0.removeFromSuperlayer() }
        }
    }
    
    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
        UIView.animate(withDuration: 0.2) {
            self.delegate?.alpha = 1;
        }
        if isValide {
            stack.push(item: item)
            prepareNewLayers()
            delegate?.gobackBtn.isEnabled = true
        } else {
            item?.layers.forEach{ $0.removeFromSuperlayer() }
        }
    }
}

// helper
private extension SpiralityCanvas {
    
    func convertPointByCenterOfPoint(point:CGPoint, index:Int) -> CGPoint {
        let center = CGPoint(x:self.bounds.width/2.0, y:self.bounds.height/2.0)
        let increaseAngle = Double.pi * 2.0 * Double(index) / Double(numberOfDrawer);
        let radius: Double = sqrt(pow(Double(point.x) - Double(center.x), 2) + pow(Double(point.y) - Double(center.y), 2))
        let angle: Double = getAngleOnXAxisFromPoint(startPoint: center, endPoint: point) + increaseAngle
        return CGPoint(x: cos(angle) * radius + Double(center.x), y: sin(angle)*radius + Double(center.y))
    }
    
    func getAngleOnXAxisFromPoint(startPoint:CGPoint, endPoint:CGPoint) -> Double {
        let xForwardPoint = CGPoint.init(x: startPoint.x + 10, y: startPoint.y)
        let a = endPoint.x - startPoint.x;
        let b = endPoint.y - startPoint.y;
        let c = xForwardPoint.x - startPoint.x;
        let d = xForwardPoint.y - startPoint.y;
        var rads = acos(((a*c) + (b*d)) / ((sqrt(a*a + b*b)) * (sqrt(c*c + d*d))));
        if (startPoint.y > endPoint.y) {
            rads = -rads;
        }
        return Double(rads);
    }
}

// public
extension SpiralityCanvas {
    
    func recoverHistoryRecord() {
        if stack.isEnableMoveItemForward {
            let item = stack.forward()!
            item.layers.forEach{ layer.addSublayer($0) }
        }
        delegate?.gobackBtn.isEnabled = stack.isEnableCancelLastItem
        delegate?.goForwardBtn.isEnabled = stack.isEnableMoveItemForward
    }
    
    func withdrawHistoryRecord() {
        if stack.isEnableCancelLastItem {
            let item = stack.pop()!
            item.layers.forEach{ $0.removeFromSuperlayer() }
        }
        delegate?.gobackBtn.isEnabled = stack.isEnableCancelLastItem
        delegate?.goForwardBtn.isEnabled = stack.isEnableMoveItemForward
    }
    
    func cleanAll() {
        UserDefaults.standard.set(true, forKey: FirstPreLoadImageKey);
        UserDefaults.standard.synchronize()
        
        stack.clean()
        prepareNewLayers()
        delegate?.gobackBtn.isEnabled = stack.isEnableCancelLastItem
        delegate?.goForwardBtn.isEnabled = stack.isEnableMoveItemForward
    }
}

