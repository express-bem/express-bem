(function(g) {
  var __bem_xjst = function(exports, Vow) {
     var $$mode = "", $$block = "", $$elem = "", $$elemMods = null, $$mods = null;

var __$ref = {};

function apply(ctx) {
    try {
        return applyc(ctx || this, __$ref);
    } catch (e) {
        e.xjstContext = ctx || this;
        throw e;
    }
}

exports.apply = apply;

function applyc(__$ctx, __$ref) {
    var cache;
    var cache;
    var __$r = __$g0(__$ctx, __$ref);
    if (__$r !== __$ref) return __$r;
}

[ function(exports) {
    var undef, BEM_ = {}, toString = Object.prototype.toString, isArray = Array.isArray || function(obj) {
        return toString.call(obj) === "[object Array]";
    }, buildEscape = function() {
        var ts = {
            '"': "&quot;",
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;"
        }, f = function(t) {
            return ts[t] || t;
        };
        return function(r) {
            r = new RegExp(r, "g");
            return function(s) {
                return ("" + s).replace(r, f);
            };
        };
    }();
    function BEMContext(context, apply_) {
        this.ctx = context;
        this.apply = apply_;
        this._buf = {};
        this.__queue = [];
        this._ = this;
        this._mode = "";
        this.block = undef;
        this.elem = undef;
        this.mods = undef;
        this.elemMods = undef;
    }
    BEMContext.prototype.isArray = isArray;
    BEMContext.prototype.isSimple = function isSimple(obj) {
        var t = typeof obj;
        return t === "string" || t === "number" || t === "boolean";
    };
    BEMContext.prototype.extend = function extend(o1, o2) {
        if (!o1 || !o2) return o1 || o2;
        var res = {}, n;
        for (n in o1) o1.hasOwnProperty(n) && (res[n] = o1[n]);
        for (n in o2) o2.hasOwnProperty(n) && (res[n] = o2[n]);
        return res;
    };
    var cnt = 0, id = +new Date(), expando = "__" + id, get = function() {
        return "uniq" + id + ++cnt;
    };
    BEMContext.prototype.identify = function(obj, onlyGet) {
        if (!obj) return get();
        if (onlyGet || obj[expando]) return obj[expando]; else return obj[expando] = get();
    };
    BEMContext.prototype.xmlEscape = buildEscape("[&<>]");
    BEMContext.prototype.attrEscape = buildEscape('["&<>]');
    BEMContext.prototype.generateId = function generateId() {
        return this.identify(this.ctx);
    };
    BEMContext.prototype.doAsync = function doAsync(fn) {
        var mode = this._mode, ctx = this.ctx, block = this.block, elem = this.elem, mods = this.mods, elemMods = this.elemMods, promise = Vow.invoke(fn);
        this.__queue.push(promise);
        promise.always(function() {
            this._mode = mode;
            this.ctx = ctx;
            this.block = block;
            this.elem = elem;
            this.mods = mods;
            this.elemMods = elemMods;
        }.bind(this));
        return promise;
    };
    var oldApply = exports.apply;
    exports.apply = BEMContext.applyAsync = function BEMContext_applyAsync(context) {
        var ctx = new BEMContext(context || this, oldApply);
        ctx._buf = ctx.apply();
        return Vow.allResolved(ctx.__queue).always(function() {
            return ctx._buf;
        });
    };
} ].forEach(function(fn) {
    fn(exports, this);
}, {
    recordExtensions: function(ctx) {
        ctx["_mode"] = undefined;
        ctx["ctx"] = undefined;
        ctx["block"] = undefined;
        ctx["_currBlock"] = undefined;
        ctx["elem"] = undefined;
        ctx["mods"] = undefined;
        ctx["elemMods"] = undefined;
    },
    resetApplyNext: function(ctx) {}
});

function __$b9(__$ctx, __$ref) {
    var __$r__$2;
    var __$l2__$3 = $$mode;
    $$mode = "content";
    __$r__$2 = applyc(__$ctx, __$ref);
    $$mode = __$l2__$3;
    var content__$0 = __$r__$2;
    if (content__$0 || content__$0 === 0) {
        var __$r__$4;
        var __$l0__$5 = $$mode;
        $$mode = "";
        var __$l1__$6 = __$ctx.ctx;
        __$ctx.ctx = content__$0;
        __$r__$4 = applyc(__$ctx, __$ref);
        $$mode = __$l0__$5;
        __$ctx.ctx = __$l1__$6;
        __$ctx.ctx.content = __$r__$4;
    }
    return __$ctx.ctx;
}

function __$b10(__$ctx, __$ref) {
    var ctx__$7 = __$ctx.ctx;
    if (ctx__$7 && ctx__$7 !== true || ctx__$7 === 0) {
        return ctx__$7;
    }
    return;
}

function __$b11(__$ctx, __$ref) {
    var ctx__$8 = __$ctx.ctx, len__$9 = ctx__$8.length, i__$10 = 0, buf__$11 = [];
    while (i__$10 < len__$9) buf__$11.push(function __$lb__$12() {
        var __$r__$13;
        var __$l0__$14 = __$ctx.ctx;
        __$ctx.ctx = ctx__$8[i__$10++];
        __$r__$13 = applyc(__$ctx, __$ref);
        __$ctx.ctx = __$l0__$14;
        return __$r__$13;
    }());
    return buf__$11;
}

function __$b12(__$ctx, __$ref) {
    __$ctx.ctx || (__$ctx.ctx = {});
    var vBlock__$15 = __$ctx.ctx.block, vElem__$16 = __$ctx.ctx.elem, block__$17 = __$ctx._currBlock || $$block;
    var __$r__$19;
    var __$l0__$20 = $$mode;
    $$mode = "default";
    var __$l1__$21 = $$block;
    $$block = vBlock__$15 || (vElem__$16 ? block__$17 : undefined);
    var __$l2__$22 = __$ctx._currBlock;
    __$ctx._currBlock = vBlock__$15 || vElem__$16 ? undefined : block__$17;
    var __$l3__$23 = $$elem;
    $$elem = vElem__$16;
    var __$l4__$24 = $$mods;
    $$mods = vBlock__$15 ? __$ctx.ctx.mods || (__$ctx.ctx.mods = {}) : $$mods;
    var __$l5__$25 = $$elemMods;
    $$elemMods = __$ctx.ctx.elemMods || {};
    __$r__$19 = applyc(__$ctx, __$ref);
    $$mode = __$l0__$20;
    $$block = __$l1__$21;
    __$ctx._currBlock = __$l2__$22;
    $$elem = __$l3__$23;
    $$mods = __$l4__$24;
    $$elemMods = __$l5__$25;
    return __$r__$19;
}

function __$g0(__$ctx, __$ref) {
    var __$t = $$mode;
    if (__$t === "content") {
        var __$t = $$block;
        if (__$t === "about-content") {
            if (!$$elem) {
                return [ {
                    block: "section",
                    content: [ {
                        elem: "header",
                        mods: {
                            bg: "red",
                            icon: "about"
                        },
                        content: "О Проекте",
                        message: "Тестирование"
                    }, {
                        elem: "note",
                        content: ""
                    }, {
                        elem: "search-m",
                        mods: {
                            a: 123
                        }
                    }, {
                        block: "content-filter",
                        content: [ {
                            block: "tabbed-pane",
                            mix: {
                                elem: "tabs"
                            },
                            js: {
                                id: "page-filters"
                            },
                            tag: "section",
                            content: [ {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 12
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Участники"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: "3"
                                } ]
                            }, {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 13
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Проекты"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: "6"
                                } ]
                            }, {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 9
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Поддержать!"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: ""
                                } ]
                            }, {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 14
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Вакансии"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: "3"
                                } ]
                            }, {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 999
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Связь"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: ""
                                } ]
                            }, {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 111
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "ЧаВо"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: "22"
                                } ]
                            } ]
                        } ]
                    }, {
                        block: "tabbed-pane",
                        mix: {
                            elem: "panels"
                        },
                        js: {
                            id: "page-filters"
                        },
                        tag: "section",
                        content: [ {
                            elem: "panel",
                            js: {
                                id: 12
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Стримеры:</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="Ведущий стример lerss">lerss</a>', '<a class="section__menu-sub_link" target="_blank" href="http://goodgame.ru/channel/alex_karachun/" title="Канал Алекса на goodgame - АМ-Инфоканал, в новом окне">alex_karachun</a>', '<a class="section__menu-sub_link" target="_blank" href="http://goodgame.ru/channel/gnomika/" title="Канал Юлии на goodgame - Антимайдан, в новом окне">gnomika</a>', "</p>", "<h2>Администраторы:</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin</a>', "</p>" ]
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 13
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Проекты:</h2>", '<a class="section__menu-sub_link" href="http://antimaidan-com.livejournal.com/" title="Текстовая онлайн-трансляция событий на Ю.-В. Украины, в новом окне">livejournal </a>', '<a class="section__menu-sub_link" target="_blank" href="https://www.youtube.com/user/TheSkycomposer" title="Перейти на Youtube канал TheSkycomposer, в новом окне">Youtube русский</a>', '<a class="section__menu-sub_link" target="_blank" href="https://www.youtube.com/channel/UCdnB82ob_V7EXwwcCtB1vUg/feed" title="Go to the english channel Youtube, new window">Youtube english</a>', '<a class="section__menu-sub_link" target="_blank" href="http://stopfake.su" title="Перейти на СтопФейк - Разоблачение обмана и лжи, в новом окне">StopFake.su</a>', '<a class="section__menu-sub_link" target="_blank" href="http://xn----9sbekcjk5ej.xn--p1ai/" title="Перейти на без-вести.рф - Систематизация и сбор информации о погибших и пропавших без вести на территории Украины до и после государственного переворота 2014, в новом окне">без-вести.рф</a>' ]
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 9
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Кошельки</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="">Яндекс</a>', '<a class="section__menu-sub_link" href="#" title="">PayPal</a>', "</p>" ]
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 14
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Объявление</h2>", '<p style="margin:0 auto;max-width:650px;text-align:left;">Нужны прогеры <br />(JS, верстка, BEM) в проект нового сайта.</p><p style="margin:0 auto;max-width:650px;text-align:left;">Пишите в skype <a href="#" class="section__menu-sub_link" title=""> skycomposer</a> <br /></p>' ]
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 999
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Контакты</h2>", '<p style="margin:0 auto;max-width:650px;text-align:left;">', 'mailto: <a href="#" class="section__menu-sub_link" title=""> antimaidan01@gmail.com</a> <br />', 'skype <a href="#" class="section__menu-sub_link" title=""> skycomposer</a> <br />', 'Твиттер <a href="https://twitter.com/odessacomposing" class="section__menu-sub_link" title="">odessacomposing</a> <br />', 'Youtube <a href="https://www.youtube.com/user/TheSkycomposer" class="section__menu-sub_link" title="">русский</a> <br />', 'Youtube  <a href="https://www.youtube.com/channel/UCdnB82ob_V7EXwwcCtB1vUg/feed" class="section__menu-sub_link" title="">english</a> <br />', " <br /> <br /><h3>Подписывайтесь, ставьте лайки! распространяйте эту ссылку.</h3> <br /> </p>" ]
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 111
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Вопросы:</h2> <br />", "<h2>Ответы:</h2> <br />" ]
                            } ]
                        } ]
                    } ]
                } ];
            }
        } else if (__$t === "links-content") {
            if (!$$elem) {
                return [ {
                    block: "section",
                    content: [ {
                        block: "title",
                        mods: {
                            bg: "red",
                            icon: "links"
                        },
                        content: "Ресурсы",
                        message: "Тестирование"
                    }, {
                        block: "note",
                        content: ""
                    }, {
                        block: "search-m",
                        mods: {
                            a: 123
                        }
                    }, {
                        block: "content-filter",
                        content: [ {
                            block: "tabbed-pane",
                            mix: {
                                elem: "tabs"
                            },
                            js: {
                                id: "page-filters"
                            },
                            tag: "section",
                            content: [ {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 12
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Официальные"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: "11"
                                } ]
                            }, {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 21
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Сообщества"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: "15"
                                } ]
                            }, {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 14
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Персоны"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: "8"
                                } ]
                            }, {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 999
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Чёрный список"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: "22"
                                } ]
                            }, {
                                block: "content-filter",
                                elem: "tab",
                                mix: {
                                    block: "tabbed-pane",
                                    elem: "tab",
                                    js: {
                                        id: 778
                                    }
                                },
                                content: [ {
                                    block: "content-filter",
                                    elem: "title",
                                    content: "Белый список"
                                }, {
                                    block: "content-filter",
                                    elem: "hint",
                                    content: "99"
                                } ]
                            } ]
                        } ]
                    }, {
                        block: "tabbed-pane",
                        mix: {
                            elem: "panels"
                        },
                        js: {
                            id: "page-filters"
                        },
                        tag: "section",
                        content: [ {
                            elem: "panel",
                            js: {
                                id: 12
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Донецкая народная республика</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin</a>', "</p>", "<h2>Луганская народная республика</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin</a>', "</p>", "<h2>Новороссия</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin</a>', "</p>", "<h2>Россия</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin</a>', "</p>", "<h2>Украина</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin</a>', "</p>" ]
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 21
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>вКонтакте</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin1</a>', '<a class="section__menu-sub_link" href="#" title="admin">admin2</a>', '<a class="section__menu-sub_link" href="#" title="admin">admin3</a>', "</p>", "<h2>Одноклассники</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin1</a>', '<a class="section__menu-sub_link" href="#" title="admin">admin2</a>', '<a class="section__menu-sub_link" href="#" title="admin">admin3</a>', "</p>", "<h2>Facebook</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin1</a>', '<a class="section__menu-sub_link" href="#" title="admin">admin2</a>', '<a class="section__menu-sub_link" href="#" title="admin">admin3</a>', "</p>", "<h2>МайлРу</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">admin1</a>', '<a class="section__menu-sub_link" href="#" title="admin">admin2</a>', '<a class="section__menu-sub_link" href="#" title="admin">admin3</a>', "</p>" ]
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 14
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Персональные страницы</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">О. Царёв</a>', '<a class="section__menu-sub_link" href="#" title="admin">Стрелков</a>', '<a class="section__menu-sub_link" href="#" title="admin">путник</a>', '<a class="section__menu-sub_link" href="#" title="admin">Шарий</a>', "</p>" ]
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 999
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Чёрный список</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">фейк</a>', '<a class="section__menu-sub_link" href="#" title="admin">пропаганда</a>', '<a class="section__menu-sub_link" href="#" title="admin">фишинг</a>', "</p>" ]
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 778
                            },
                            content: [ {
                                block: "section",
                                elem: "menu-sub",
                                content: [ "<h2>Белый список</h2>", '<p style="margin:0 auto;max-width:650px;">', '<a class="section__menu-sub_link" href="#" title="admin">новости</a>', '<a class="section__menu-sub_link" href="#" title="admin">аналитика</a>', '<a class="section__menu-sub_link" href="#" title="admin">общение</a>', "</p>" ]
                            } ]
                        } ]
                    } ]
                } ];
            }
        } else if (__$t === "streams-content") {
            if (!$$elem) {
                return [ {
                    block: "title",
                    mods: {
                        bg: "blue",
                        icon: "streams"
                    },
                    content: "Стримы"
                }, {
                    block: "note"
                }, {
                    block: "search"
                }, {
                    block: "content-filter",
                    content: [ {
                        block: "tabbed-pane",
                        mix: {
                            elem: "tabs"
                        },
                        js: {
                            id: "page-filters"
                        },
                        tag: "section",
                        content: [ {
                            block: "content-filter",
                            elem: "tab",
                            mix: {
                                block: "tabbed-pane",
                                elem: "tab",
                                js: {
                                    id: 21
                                }
                            },
                            content: [ {
                                block: "content-filter",
                                elem: "title",
                                content: "все стримы"
                            }, {
                                block: "content-filter",
                                elem: "hint",
                                content: ""
                            } ]
                        }, {
                            block: "content-filter",
                            elem: "tab",
                            mix: {
                                block: "tabbed-pane",
                                elem: "tab",
                                js: {
                                    id: 12
                                }
                            },
                            content: [ {
                                block: "content-filter",
                                elem: "title",
                                content: "активные"
                            }, {
                                block: "content-filter",
                                elem: "hint",
                                content: ""
                            } ]
                        }, {
                            block: "content-filter",
                            elem: "tab",
                            mix: {
                                block: "tabbed-pane",
                                elem: "tab",
                                js: {
                                    id: 14
                                }
                            },
                            content: [ {
                                block: "content-filter",
                                elem: "title",
                                content: "по городам"
                            }, {
                                block: "content-filter",
                                elem: "hint",
                                content: ""
                            } ]
                        }, {
                            block: "content-filter",
                            elem: "tab",
                            mix: {
                                block: "tabbed-pane",
                                elem: "tab",
                                js: {
                                    id: 999
                                }
                            },
                            content: [ {
                                block: "content-filter",
                                elem: "title",
                                content: "по дате"
                            }, {
                                block: "content-filter",
                                elem: "hint",
                                content: ""
                            } ]
                        } ]
                    }, {
                        block: "tabbed-pane",
                        mix: {
                            elem: "panels"
                        },
                        js: {
                            id: "page-filters"
                        },
                        tag: "section",
                        content: [ {
                            elem: "panel",
                            js: {
                                id: 21
                            },
                            content: []
                        }, {
                            elem: "panel",
                            js: {
                                id: 12
                            },
                            content: []
                        }, {
                            elem: "panel",
                            js: {
                                id: 14
                            },
                            content: [ {
                                block: "places-filter"
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 999
                            },
                            content: [ {
                                block: "calendar"
                            } ]
                        } ]
                    } ]
                }, {
                    block: "result",
                    content: "результат поиска"
                }, {
                    block: "pagination",
                    mods: {
                        id: "top"
                    }
                }, {
                    elem: "announse-posts",
                    mods: {
                        "short": true
                    },
                    content: []
                }, {
                    block: "pagination",
                    mods: {
                        id: "bottom"
                    }
                } ];
            }
        } else if (__$t === "calendar") {
            if (!$$elem) {
                return [ '<div class="calendar_year">', '<a href="#" class="calendar_year_link" title="">2013</a>', '<a href="#" class="calendar_year_link" title="Вы тут">2014</a>', "</div>", '<div class="calendar_month">', '<a href="#" class="calendar_month_link" id="0" title="Вы тут">Январь</a>', '<a href="#" class="calendar_month_link" id="1" title="">Февраль</a>', '<a href="#" class="calendar_month_link" id="2" title="">Март</a>', '<a href="#" class="calendar_month_link" id="3" title="">Апрель</a>', '<a href="#" class="calendar_month_link" id="4" title="">Май</a>', '<a href="#" class="calendar_month_link" id="5" title="">Июнь</a>', '<a href="#" class="calendar_month_link" id="6" title="">Июль</a>', '<a href="#" class="calendar_month_link" id="7" title="">Август</a>', '<a href="#" class="calendar_month_link" id="8" title="">Сентябрь</a>', '<a href="#" class="calendar_month_link" id="9" title="">Октябрь</a>', '<a href="#" class="calendar_month_link" id="10" title="">Ноябрь</a>', '<a href="#" class="calendar_month_link" id="11" title="">Декабрь</a>', "</div>", '<div class="calendar_day">', '<a href="#" class="calendar_day_link" title="">1</a>', '<a href="#" class="calendar_day_link saturday" title="">2</a>', '<a href="#" class="calendar_day_link sunday" title="">3</a>', '<a href="#" class="calendar_day_link monday" title="">4</a>', '<a href="#" class="calendar_day_link" title="">5</a>', '<a href="#" class="calendar_day_link" title="">6</a>', '<a href="#" class="calendar_day_link" title="">7</a>', '<a href="#" class="calendar_day_link" title="">8</a>', '<a href="#" class="calendar_day_link saturday" title="">9</a>', '<a href="#" class="calendar_day_link sunday" title="Вы тут">10</a>', '<a href="#" class="calendar_day_link monday" title="">11</a>', '<a href="#" class="calendar_day_link" title="">12</a>', '<a href="#" class="calendar_day_link" title="">13</a>', '<a href="#" class="calendar_day_link" title="">14</a>', '<a href="#" class="calendar_day_link" title="">15</a>', '<a href="#" class="calendar_day_link saturday" title="">16</a>', '<a href="#" class="calendar_day_link sunday" title="">17</a>', '<a href="#" class="calendar_day_link monday" title="">18</a>', '<a href="#" class="calendar_day_link" title="">19</a>', '<a href="#" class="calendar_day_link" title="">20</a>', '<a href="#" class="calendar_day_link" title="">21</a>', '<a href="#" class="calendar_day_link" title="">22</a>', '<a href="#" class="calendar_day_link saturday" title="">23</a>', '<a href="#" class="calendar_day_link sunday" title="">24</a>', '<a href="#" class="calendar_day_link monday" title="">25</a>', '<a href="#" class="calendar_day_link" title="">26</a>', '<a href="#" class="calendar_day_link" title="">27</a>', '<a href="#" class="calendar_day_link" title="">28</a>', '<a href="#" class="calendar_day_link" title="">29</a>', '<a href="#" class="calendar_day_link saturday" title="">30</a>', '<a href="#" class="calendar_day_link sunday" title="">31</a>', "</div>" ];
            }
        } else if (__$t === "places-filter") {
            if (!$$elem) {
                return [ '<a href="#" class="places-filter_link" title="Горловка">Горловка</a>', '<a href="#" class="places-filter_link" title="Дзержинск">Дзержинск</a>', '<a href="#" class="places-filter_link" title="Днепропетровск">Днепропетровск</a>', '<a href="#" class="places-filter_link" title="Донецк">Донецк</a>', '<a href="#" class="places-filter_link" title="Запорожье">Запорожье</a>', '<a href="#" class="places-filter_link" title="Канев">Канев</a>', '<a href="#" class="places-filter_link icon__title_warn" title="Каховка. флажок.icon__title_warn надо связать с header_message в header_title, (Внимание! Камеры в Каховке не работают!)">Каховка</a>', '<a href="#" class="places-filter_link" title="Киев">Киев</a>', '<a href="#" class="places-filter_link" title="Краматорск">Краматорск</a>', '<a href="#" class="places-filter_link" title="Кременчуг">Кременчуг</a>', '<a href="#" class="places-filter_link" title="Луганск">Луганск</a>', '<a href="#" class="places-filter_link" title="Мариуполь">Мариуполь</a>', '<a href="#" class="places-filter_link" title="Одесса">Одесса</a>', '<a href="#" class="places-filter_link" title="Севастополь">Севастополь</a>', '<a href="#" class="places-filter_link" title="Северодонецк">Северодонецк</a>', '<a href="#" class="places-filter_link" title="Славянск">Славянск</a>', '<a href="#" class="places-filter_link" title="Харьков">Харьков</a>', '<a href="#" class="places-filter_link" title="Херсон">Херсон</a>', '<a href="#" class="places-filter_link" title="Черновцы">Черновцы</a>' ];
            }
        } else if (__$t === "events-content") {
            if (!$$elem) {
                return [ {
                    block: "title",
                    mods: {
                        bg: "red",
                        icon: "events"
                    },
                    content: "Новости"
                }, {
                    block: "search"
                }, {
                    block: "note"
                }, {
                    block: "content-filter",
                    content: [ {
                        block: "tabbed-pane",
                        mix: {
                            elem: "tabs"
                        },
                        js: {
                            id: "page-filters"
                        },
                        tag: "section",
                        content: [ {
                            block: "content-filter",
                            mods: {
                                post: true
                            },
                            elem: "tab",
                            mix: {
                                block: "tabbed-pane",
                                elem: "tab",
                                js: {
                                    id: 13
                                }
                            },
                            content: [ {
                                block: "content-filter",
                                elem: "title",
                                content: "Я читаю"
                            } ]
                        }, {
                            block: "content-filter",
                            elem: "tab",
                            mix: {
                                block: "tabbed-pane",
                                elem: "tab",
                                js: {
                                    id: 12
                                }
                            },
                            content: [ {
                                block: "link",
                                url: "#events",
                                content: "за сегодня"
                            } ]
                        }, {
                            block: "content-filter",
                            elem: "tab",
                            mix: {
                                block: "tabbed-pane",
                                elem: "tab",
                                js: {
                                    id: 14
                                }
                            },
                            content: [ {
                                block: "link",
                                url: "#events/places",
                                content: "по городам"
                            } ]
                        }, {
                            block: "content-filter",
                            elem: "tab",
                            mix: {
                                block: "tabbed-pane",
                                elem: "tab",
                                js: {
                                    id: 21
                                }
                            },
                            content: [ {
                                block: "link",
                                url: "#events/all",
                                content: "все новости"
                            } ]
                        }, {
                            block: "content-filter",
                            elem: "tab",
                            mix: {
                                block: "tabbed-pane",
                                elem: "tab",
                                js: {
                                    id: 999
                                }
                            },
                            content: [ {
                                block: "link",
                                url: "#events/date",
                                content: "по дате"
                            } ]
                        } ]
                    }, {
                        block: "tabbed-pane",
                        mix: {
                            elem: "panels"
                        },
                        js: {
                            id: "page-filters"
                        },
                        tag: "section",
                        content: [ {
                            elem: "panel",
                            js: {
                                id: 12
                            },
                            content: []
                        }, {
                            elem: "panel",
                            js: {
                                id: 14
                            },
                            content: [ {
                                block: "places-filter"
                            } ]
                        }, {
                            elem: "panel",
                            js: {
                                id: 21
                            },
                            content: []
                        }, {
                            elem: "panel",
                            js: {
                                id: 999
                            },
                            content: [ {
                                block: "calendar"
                            } ]
                        } ]
                    } ]
                }, {
                    block: "result",
                    content: "результат поиска"
                }, {
                    block: "pagination",
                    mods: {
                        id: "top"
                    }
                }, {
                    elem: "announse-posts",
                    mods: {
                        "short": true
                    },
                    content: []
                }, {
                    block: "pagination",
                    mods: {
                        id: "bottom"
                    }
                } ];
            }
        } else if (__$t === "toolbar") {
            if (!$$elem) {
                return [ '<div class="toolbar__launcher">', '<a href=""></a>', "</div>", '<div class="toolbar__top"><!----><span class="toolbar__navy"><!--&#139;--></span><span class="toolbar__name">', "Вход", "</span><!----></div>", '<div class="toolbar__left">', '<div class="toolbar__photo">', "</div>", '<span class="toolbar__left-links">', '<a class="toolbar__left-links_link" href="">Профиль</a><!----><a class="toolbar__left-links_link active" href="">Вход</a>', "</span>", '</div><!----><div class="toolbar__right">', '<div class="toolbar__right_subject">', "Введите Логин и пароль", '</div><!----><div class="toolbar__right_form1">', '<input class="form1__input_start" type="text" required placeholder="| e-mail или логин">', '<input class="form1__input_end" type="password" required placeholder="| пароль">', '<i class="form1__note">', "Я забыл, напомните мне на e-mail!", "</i>", '<input class="form1__input_end" type="text" required placeholder="| e-mail">', "</div>", "</div>", '<div class="toolbar__bottom">', '<button class="buttons__ansver">?', '</button><input class="input__reset" type="reset" value="Отмена"><input class="input__submit" type="submit" value="Готово">', "</div>" ];
            }
        }
        return __$ctx.ctx.content;
    } else if (__$t === "default") {
        var __$r = __$b9(__$ctx, __$ref);
        if (__$r !== __$ref) return __$r;
    } else if (__$t === "") {
        if (__$ctx.isSimple(__$ctx.ctx)) {
            var __$r = __$b10(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        if (__$ctx.isArray(__$ctx.ctx)) {
            var __$r = __$b11(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        var __$r = __$b12(__$ctx, __$ref);
        if (__$r !== __$ref) return __$r;
    }
    return __$ref;
};
     return exports;
  }
  var defineAsGlobal = true;
  if(typeof exports === "object") {
    exports["BEMTREE"] = __bem_xjst({});
    defineAsGlobal = false;
  }
  if(typeof modules === "object") {
    modules.define("BEMTREE", ["vow"],
      function(provide, Vow) {
        provide(__bem_xjst({}, Vow)) });
    defineAsGlobal = false;
  }
  defineAsGlobal && (g["BEMTREE"] = __bem_xjst({}));
})(this);