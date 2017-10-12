<%--
  Created by IntelliJ IDEA.
  User: k_way
  Date: 2017/10/10
  Time: 18:11
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>主页</title>
    <script type="application/javascript" src="jquery.min.js"></script>
    <script type="application/javascript" src="jquery.base64.js"></script>
    <script type="application/javascript" src="static/kaptcha/kaptcha.js"></script>
    <link rel="stylesheet"  href="static/kaptcha/kaptcha.css"/>
    <style>
    </style>
</head>
<body>
<div>
    <div class="myabc"></div>
</div>

<script type="application/javascript">
    $('.myabc').MyCaptcha();
</script>
</body>
</html>
