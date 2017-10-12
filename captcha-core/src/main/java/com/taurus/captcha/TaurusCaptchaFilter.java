package com.taurus.captcha;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import sun.misc.BASE64Decoder;

import javax.imageio.ImageIO;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Kelvin Yeung on 2017/10/9.
 */
public class TaurusCaptchaFilter implements Filter{

    public static final String SESSION_ATTR_CAPTCHAT = "clickTextCaptcha";
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String uri = request.getRequestURI();
        //获取验证码
        if("/captcha".equals(uri)){
            ClickTextCaptcha captcha = GraphicsEngine.genClickTextCaptcha();
            request.getSession().setAttribute(SESSION_ATTR_CAPTCHAT, captcha);
            response.setHeader("Content-Type", "application/json;charset=UTF-8");
            Map resultMap = new HashMap();
            resultMap.put("status","OK");
            resultMap.put("data",captcha.getWords());
            PrintWriter writer = response.getWriter();
            ObjectMapper om = new ObjectMapper();
            writer.write(om.writeValueAsString(resultMap));
            writer.close();
            return;
        }else if("/checkCaptcha".equals(uri)){
            //验证验证码
            String clickPointStr = request.getParameter("a");
            BASE64Decoder decoder = new BASE64Decoder();
            byte[] b =decoder.decodeBuffer(clickPointStr);
            String decodedStr = new String(b);
            ObjectMapper om = new ObjectMapper();
            List list = om.readValue(decodedStr,new TypeReference<List<ClickPoint>>() {});
            ClickTextCaptcha captcha  = (ClickTextCaptcha) request.getSession().getAttribute(SESSION_ATTR_CAPTCHAT);
            boolean result = GraphicsEngine.checkClickTextCaptcha(list,captcha.getRectangles());
            Map resultMap = new HashMap();
            if(result){
                resultMap.put("status","OK");
            }else{
                resultMap.put("status","FAIL");
            }
            String resultStr = om.writeValueAsString(resultMap);
            response.setHeader("Content-Type", "application/json;charset=UTF-8");
            PrintWriter writer = response.getWriter();
            writer.write(resultStr);
            writer.close();
            return;
        }else if("/captchaImg".equals(uri)){
            ClickTextCaptcha captcha = (ClickTextCaptcha) request.getSession().getAttribute(SESSION_ATTR_CAPTCHAT);
            if(null == captcha){
                return;
            }
            response.setHeader("Content-Type", "image/jpeg");
            OutputStream os = response.getOutputStream();
            ImageIO.write(captcha.getImage(), "jpg", os);
            os.close();
            return;
        }


        filterChain.doFilter(servletRequest,servletResponse);


    }

    public void destroy() {

    }
}
