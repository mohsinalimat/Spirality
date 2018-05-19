//
//  ViewController.swift
//  CircleDrawer
//
//  Created by XcodeYang on 22/11/2017.
//  Copyright © 2017 XcodeYang. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
    
    override var shouldAutorotate: Bool {
        return true
    }
    
//    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
//        return UIInterfaceOrientationMask.landscape
//    }
    
    override var preferredInterfaceOrientationForPresentation: UIInterfaceOrientation {
        return UIInterfaceOrientation.landscapeLeft
    }
    
    lazy var canvas: SpiralityCanvas = {
        let canvas = SpiralityCanvas()
        canvas.numberOfDrawer = 30;
        return canvas
    }()
    
    lazy var overlayer: OverlayerView = {
        let overlayer: OverlayerView = Bundle.main.loadNibNamed("OverlayerView", owner: nil, options: nil)?.first as! OverlayerView
        return overlayer
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        canvas.delegate = overlayer
        overlayer.delegate = canvas
        view.addSubview(overlayer)
        view.insertSubview(canvas, at: 0)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        let lanuchController = UIStoryboard.init(name: "LaunchScreen", bundle: nil).instantiateViewController(withIdentifier: "LaunchScreen")
        lanuchController.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(lanuchController.view)
        UIView.animate(withDuration: 1, delay: 1, options: UIViewAnimationOptions.curveEaseInOut, animations: {
            lanuchController.view.alpha = 0
        }, completion: { _ in
            lanuchController.view.removeFromSuperview()
        })
    }
    
    override func viewDidLayoutSubviews() {
        let length = max(view.bounds.width, view.bounds.height)
        canvas.frame = CGRect.init(x: (view.bounds.width-length)/2.0, y: (view.bounds.height-length)/2.0, width: length, height: length)
        overlayer.frame = view.bounds
    }
}

