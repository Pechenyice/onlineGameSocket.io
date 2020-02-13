


window.onload = () => {
    var canBeConnected = 0;


    var guestButton = document.getElementById("guestButton");
    guestButton.addEventListener('click', () => {
        document.getElementById('guestName').style.opacity = '1';
        document.getElementById('guestForm').style.marginTop = '35%';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('buttons').style.display = 'none';
        document.getElementById('registerForm').style.display = 'none';
        backRegister.style.display = 'flex';
        setTimeout(() => {
            backRegister.style.opacity = '1';
        }, 4);
        guestButton.style.animation = 'buttonChange';
        guestButton.style.animationDuration = '1s';
        guestButton.style.animationIterationCount = '1';
        setTimeout(() => {
            guestButton.innerHTML = "<p>Confirm</p>";
        }, 500);
    });

    var backRegister = document.getElementById('backRegister');

    backRegister.addEventListener('click', () => {
        document.getElementById('guestName').style.opacity = '0';
        document.getElementById('guestForm').style.marginTop = '25%';
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('buttons').style.display = 'block';
        document.getElementById('registerForm').style.display = 'block';
        backRegister.style.opacity = '0';
        setTimeout(() => {
            backRegister.style.display = 'none';
        }, 500);
        // guestButton.style.opacity = 0;
        guestButton.style.animation = 'buttonBackChange';
        guestButton.style.animationDuration = '1s';
        guestButton.style.animationIterationCount = '1';
        setTimeout(() => {
            guestButton.innerHTML = "<p>Enter as guest</p>";
        }, 500);
        document.getElementById('guestCheck').setAttribute('href', 'javascropt:0');
    });

    var active = 0;

    var loginRegister = document.getElementById('loginRegister');

    loginRegister.addEventListener('click', () => {
        if (active == 1) {
            document.getElementById('buttons').style.top = '20%';
            document.getElementById('registerButton').style.opacity = '1';
            // setTimeout(() => {
                document.getElementById('loginForm').style.opacity = '0';
            // }, 500);
            document.getElementById('guestForm').style.opacity = '1';
            loginRegister.style.opacity = '0';
            setTimeout(() => {
                loginRegister.style.display = 'none';
            }, 500);
            document.getElementById('loginForm').style.height = '15%';
            loginButton.style.animation = 'buttonBackChange';
            loginButton.style.animationDuration = '1s';
            loginButton.style.animationIterationCount = '1';
            setTimeout(() => {
                loginButton.innerHTML = "<p>Log in</p>";
            }, 500);
            document.getElementById('guestForm').style.display = 'block';
            active = 0;
        } else if (active == 2) {
            document.getElementById('buttons').style.top = '20%';
            document.getElementById('loginButton').style.opacity = '1';
            // setTimeout(() => {
                document.getElementById('registerForm').style.opacity = '0';
            // }, 500);
            loginRegister.style.opacity = '0';
            setTimeout(() => {
                loginRegister.style.display = 'none';
            }, 500);
            document.getElementById('guestForm').style.opacity = '1';
            document.getElementById('registerForm').style.top = '80%';
            document.getElementById('registerForm').style.height = '25%';
            registerButton.style.animation = 'buttonBackChange';
            registerButton.style.animationDuration = '1s';
            registerButton.style.animationIterationCount = '1';
            setTimeout(() => {
                registerButton.innerHTML = "<p>Sign up</p>";
            }, 500);
            document.getElementById('guestForm').style.display = 'block';
            active = 0;
        }
    }); 

    var loginButton = document.getElementById("loginButton");
    loginButton.addEventListener('click', () => {
        document.getElementById('buttons').style.top = '45%';
        document.getElementById('registerButton').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loginForm').style.opacity = '1';
        }, 500);
        document.getElementById('guestForm').style.opacity = '0';
        loginRegister.style.display = 'flex';
        setTimeout(() => {
            loginRegister.style.opacity = '1';
        }, 4);
        document.getElementById('guestForm').style.display = 'none';
        document.getElementById('loginForm').style.height = '40%';
        loginButton.style.animation = 'buttonChange';
        loginButton.style.animationDuration = '1s';
        loginButton.style.animationIterationCount = '1';
        setTimeout(() => {
            loginButton.innerHTML = "<p>Start game</p>";
        }, 500);
        active = 1;

        loginButton.addEventListener('click', () => {

            if (loginName.value != "Введите имя" && loginName.value != "" && loginName.value != " " && loginPassword.value != "Введите пароль" && loginPassword.value != "" && loginPassword.value != " ") {
                var xhr = new XMLHttpRequest();
                xhr.open('post', '/connectPlayer');
                xhr.setRequestHeader("Content-type", "application/json");
                // alert(JSON.stringify({username: guestName.value}));
                xhr.send(JSON.stringify({name: loginName.value, password: loginPassword.value}));
                xhr.onload = () => {
                    var canBeConnected = JSON.parse(xhr.response).value;
                    if (canBeConnected) {
                        var xml = new XMLHttpRequest();
                        xml.open('get', '/game');
                        xml.send();
                        xml.onload = () => {
                            document.write(xml.response);
                        }
                    } else {
                        var xml = new XMLHttpRequest();
                        xml.open('get', '/notFound');
                        xml.send();
                        xml.onload = () => {
                            document.write(xml.response);
                        }
                    }
                }
            } else {
                if (loginName.value == "" || loginName.value == " ") {
                    guestName.value = "Введите имя";
                }
                if (loginPassword.value == "" || loginPassword.value == " ") {
                    guestName.value = "Введите пароль";
                }
            }
        });
    });

    var registerButton = document.getElementById("registerButton");
    registerButton.addEventListener('click', () => {
        document.getElementById('buttons').style.top = '-5%';
        document.getElementById('loginButton').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('registerForm').style.opacity = '1';
        }, 500);
        loginRegister.style.display = 'flex';
        setTimeout(() => {
            loginRegister.style.opacity = '1';
        }, 4);
        document.getElementById('guestForm').style.display = 'none';
        document.getElementById('guestForm').style.opacity = '0';
        document.getElementById('registerForm').style.top = '50%';
        document.getElementById('registerForm').style.height = '40%';
        registerButton.style.animation = 'buttonChange';
        registerButton.style.animationDuration = '1s';
        registerButton.style.animationIterationCount = '1';
        setTimeout(() => {
            registerButton.innerHTML = "<p>Join community</p>";
        }, 500);
        active = 2;
        registerButton.addEventListener('click', () => {

            if (registerName.value != "Введите имя" && registerName.value != "" && registerName.value != " " && registerPassword.value != "Введите пароль" && registerPassword.value != "" && registerPassword.value != " ") {
                var xhr = new XMLHttpRequest();
                xhr.open('post', '/newPlayer');
                xhr.setRequestHeader("Content-type", "application/json");
                // alert(JSON.stringify({username: guestName.value}));
                xhr.send(JSON.stringify({name: registerName.value, password: registerPassword.value}));
                xhr.onload = () => {
                    var canBeConnected = JSON.parse(xhr.response).connection;
                    if (canBeConnected) {
                        var xml = new XMLHttpRequest();
                        xml.open('get', '/game');
                        xml.send();
                        xml.onload = () => {
                            document.write(xml.response);
                        }
                    } else {
                        var xml = new XMLHttpRequest();
                        xml.open('get', '/notFound');
                        xml.send();
                        xml.onload = () => {
                            document.write(xml.response);
                        }
                    }
                }
            } else {
                if (registerName.value == "" || registerName.value == " ") {
                    guestName.value = "Введите имя";
                }
                if (registerPassword.value == "" || registerPassword.value == " ") {
                    guestName.value = "Введите пароль";
                }
            }
        });
    });

    var guestName = document.getElementById('guestName');
    guestName.addEventListener('focus', () => {
        guestName.value = "";
    });
    guestName.addEventListener('focusout', () => {
        if (guestName.value == "" || guestName.value == " ") {
            guestName.value = "Введите имя";
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open('post', '/newUserName');
            xhr.setRequestHeader("Content-type", "application/json");
            // alert(JSON.stringify({username: guestName.value}));
            xhr.send(JSON.stringify({username: guestName.value}));
            xhr.onload = () => {
                // alert(JSON.parse(xhr.response).value);
                canBeConnected = JSON.parse(xhr.response).value;
                if (canBeConnected) {
                    document.getElementById('guestCheck').setAttribute('href', '/game');
                }
            }
        }
    });

    var loginName = document.getElementById('loginName');
    loginName.addEventListener('focus', () => {
        loginName.value = "";
    });
    loginName.addEventListener('focusout', () => {
        if (loginName.value == "" || loginName.value == " ") loginName.value = "Введите имя";
    });
    var loginPassword = document.getElementById('loginPassword');
    loginPassword.addEventListener('focus', () => {
        loginPassword.value = "";
    });
    loginPassword.addEventListener('focusout', () => {
        if (loginPassword.value == "" || loginPassword.value == " ") loginPassword.value = "Введите пароль";
    });

    var registerName = document.getElementById('registerName');
    registerName.addEventListener('focus', () => {
        registerName.value = "";
    });
    registerName.addEventListener('focusout', () => {
        if (registerName.value == "" || registerName.value == " ") registerName.value = "Введите имя";
    });
    var registerPassword = document.getElementById('registerPassword');
    registerPassword.addEventListener('focus', () => {
        registerPassword.value = "";
    });
    registerPassword.addEventListener('focusout', () => {
        if (registerPassword.value == "" || registerPassword.value == " ") registerPassword.value = "Введите пароль";
    });


}