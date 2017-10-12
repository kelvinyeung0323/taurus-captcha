package com.taurus.captcha;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.List;

/**
 * Created by Kelvin Yeung on 2017/10/10.
 */
public class ClickTextCaptcha implements Captcha {

    private String[] words;
    private List<Rectangle> rectangles;
    private BufferedImage image;

    public String[] getWords() {
        return words;
    }

    public void setWords(String[] words) {
        this.words = words;
    }

    public List<Rectangle> getRectangles() {
        return rectangles;
    }

    public void setRectangles(List<Rectangle> rectangles) {
        this.rectangles = rectangles;
    }

    public BufferedImage getImage() {
        return image;
    }

    public void setImage(BufferedImage image) {
        this.image = image;
    }


    public boolean check(List<ClickPoint> points){

        List<Rectangle> rectangles = getRectangles();
        for(int i = 0 ; i<3; i++){
            Rectangle rectangle=rectangles.get(i);
            if(points.get(i).getX() >=rectangle.getX()
                    && points.get(i).getX()<=rectangle.getX()+rectangle.getWidth()
                    && points.get(i).getY()>=rectangle.getY() - rectangle.getHeight()
                    && points.get(i).getY()<=rectangle.getY()){

               //nothing to do;
            }else{
                return false;
            }

        }

        return true;
    }
}
