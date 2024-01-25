;(function (window, document) {
    "use strict"
    var env_urls = skGetEnvironmentUrls("indeed-jobs")
    var app_url = env_urls.app_url
    var sk_api_url = env_urls.sk_api_url
    var sk_app_url = env_urls.sk_app_url
    var app_backend_url = env_urls.app_backend_url
    var app_file_server_url = env_urls.app_file_server_url
    var sk_img_url = env_urls.sk_img_url
    var original_data
    var data_storage
    var data_bio
    var last_key = 0
    var original_data
    var additional_error_messages = []
    var $grid
    var el = document.getElementsByClassName("sk-ww-indeed-jobs")[0]
    if (el == undefined) {
        var el = document.getElementsByClassName("dsm-ww-indeed-jobs")[0]
        if (el != undefined) {
            el.className = "sk-ww-indeed-jobs"
        }
    }
    if (el != undefined) {
        el.innerHTML =
            "<div class='first_loading_animation' style='text-align:center; width:100%;'><img src='" +
            app_url +
            "images/ripple.svg' class='loading-img' style='width:auto !important;' /></div>"
    }
    loadCssFile(app_url + "libs/js/magnific-popup/magnific-popup.css")
    loadCssFile(
        "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
    )
    function loadCssFile(filename) {
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref)
        }
    }
    if (window.jQuery === undefined) {
        var script_tag = document.createElement("script")
        script_tag.setAttribute("type", "text/javascript")
        script_tag.setAttribute(
            "src",
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js"
        )
        if (script_tag.readyState) {
            script_tag.onreadystatechange = function () {
                if (
                    this.readyState == "complete" ||
                    this.readyState == "loaded"
                ) {
                    scriptLoadHandler()
                }
            }
        } else {
            script_tag.onload = scriptLoadHandler
        }
        ;(
            document.getElementsByTagName("head")[0] || document.documentElement
        ).appendChild(script_tag)
    } else {
        jQuery = window.jQuery
        scriptLoadHandler()
    }
    function loadScript(url, callback) {
        var scriptTag = document.createElement("script")
        scriptTag.setAttribute("type", "text/javascript")
        scriptTag.setAttribute("src", url)
        if (typeof callback !== "undefined") {
            if (scriptTag.readyState) {
                scriptTag.onreadystatechange = function () {
                    if (
                        this.readyState === "complete" ||
                        this.readyState === "loaded"
                    ) {
                        callback()
                    }
                }
            } else {
                scriptTag.onload = callback
            }
        }
        ;(
            document.getElementsByTagName("head")[0] || document.documentElement
        ).appendChild(scriptTag)
    }
    function scriptLoadHandler() {
        loadScript(
            app_url + "libs/magnific-popup/jquery.magnific-popup.js",
            function () {
                loadScript(
                    "https://unpkg.com/masonry-layout@4.2.0/dist/masonry.pkgd.min.js",
                    function () {
                        loadScript(
                            app_url + "libs/js/swiper/swiper.min.js",
                            function () {
                                $ = jQuery = window.jQuery.noConflict(true)
                                main()
                            }
                        )
                    }
                )
            }
        )
    }
    function applySearchFeature(data_storage, search_term) {
        var new_posts_lists = []
        jQuery.each(data_storage, function (index, value) {
            if (
                value.job_title &&
                value.job_title
                    .toLowerCase()
                    .indexOf(search_term.toLowerCase()) != -1
            ) {
                new_posts_lists.push(value)
            }
        })
        return new_posts_lists
    }
    function readDevice() {
        var device = "desktop"
        if (jQuery(document).width() < 450) {
            device = "mobile"
        } else if (jQuery(document).width() < 750) {
            device = "tablet"
        }
        return device
    }
    function nl2br(str, is_xhtml) {
        if (typeof str === "undefined" || str === null) {
            return ""
        }
        var breakTag =
            is_xhtml || typeof is_xhtml === "undefined" ? "<br />" : "<br>"
        return (str + "").replace(
            /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
            "$1" + breakTag + "$2"
        )
    }
    function replaceContentWithLinks(html, sk_indeed_jobs) {
        var text = html.html()
        if (text) {
            text = text.replace(/(\r\n|\n\r|\r|\n)/g, "<br>")
            var splitted_text = text.split(" ")
            if (splitted_text && splitted_text.length > 0) {
                jQuery.each(splitted_text, function (key, value) {
                    if (value.charAt(0) == "#") {
                        var original_text = value.replace("#", "")
                        text = text.replace(
                            " " + value,
                            ' <a target="_blank" href="https://www.indeed.com/feed/hashtag/?keywords=' +
                                original_text +
                                '">' +
                                value +
                                "</a>"
                        )
                    } else if (value.charAt(0) == "@") {
                        var original_text = value.replace("@", "")
                        text = text.replace(
                            " " + value,
                            ' <a target="_blank" href="https://www.indeed.com/' +
                                original_text +
                                '">' +
                                value +
                                "</a>"
                        )
                    }
                })
                text = text.replace("<br>#", "<br> #")
                do {
                    text = text.replace("<br><br>", " <br> <br> ")
                } while (text.includes("<br><br>"))
                var splitted_text = text.split(" ")
                jQuery.each(splitted_text, function (key, value) {
                    if (value.charAt(0) == "#") {
                        var original_text = value.replace("#", "")
                        text = text.replace(
                            " " + value,
                            ' <a target="_blank" href="http://facebook.com/hashtag/' +
                                original_text +
                                '">' +
                                value +
                                "</a>"
                        )
                    } else if (value.charAt(0) == "@") {
                        var original_text = value.replace("@", "")
                        text = text.replace(
                            " " + value,
                            ' <a target="_blank" href="http://facebook.com/' +
                                original_text +
                                '">' +
                                value +
                                "</a>"
                        )
                    } else if (
                        value.charAt(0) != "<" &&
                        value.indexOf("http") != -1 &&
                        value.indexOf("href=") == -1 &&
                        value.indexOf("target=") == -1 &&
                        value.indexOf('">') == -1
                    ) {
                        text = text.replace(
                            " " + value,
                            ' <a target="_blank" href="' +
                                value +
                                '">' +
                                value +
                                "</a>"
                        )
                    }
                })
            }
            html.html(text)
            sk_indeed_jobs
                .find("a")
                .css({
                    "font-size":
                        getDsmSetting(sk_indeed_jobs, "details_font_size") +
                        "px",
                    color: getDsmSetting(sk_indeed_jobs, "details_link_color"),
                })
            applyPopUpColors(sk_indeed_jobs)
        }
    }
    function replaceHttpToLink(content) {
        var exp_match =
            /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
        var element_content = content.replace(
            exp_match,
            '<a class="href_status_trigger hide-link" target="_blank" href="$1">$1</a>'
        )
        var new_exp_match = /(^|[^\/])(www\.[\S]+(\b|$))/gim
        var new_content = element_content.replace(
            new_exp_match,
            '$1<a class="href_status_trigger hide-link" target="_blank" href="http://$2">$2</a>'
        )
        return new_content
    }
    function getDsmEmbedId(sk_indeed_jobs) {
        var embed_id = sk_indeed_jobs.attr("embed-id")
        if (embed_id == undefined) {
            embed_id = sk_indeed_jobs.attr("data-embed-id")
        }
        return embed_id
    }
    function getDsmSetting(sk_indeed_jobs, key) {
        return sk_indeed_jobs.find("." + key).text()
    }
    function orderJobsByMostRecent(sk_indeed_jobs, data) {
        if (
            getDsmSetting(sk_indeed_jobs, "username") ==
            "empire-search-partners-llc"
        ) {
            data.sort(function (a, b) {
                if (new Date(b.date).getTime() == new Date(a.date).getTime()) {
                    return parseInt(a.ago_value) - parseInt(b.ago_value)
                }
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            })
        } else {
            data.sort(function (a, b) {
                data.sort(function (a, b) {
                    return b.index - a.index
                })
            })
        }
        return data
    }
    function moderationTabFeature(sk_indeed_jobs, posts) {
        var excluded_posts = ""
        if (getDsmSetting(sk_indeed_jobs, "excluded_posts") != "") {
            excluded_posts = getDsmSetting(sk_indeed_jobs, "excluded_posts")
        }
        var new_posts_list = []
        for (let item of posts) {
            if (typeof item != "undefined") {
                if (excluded_posts.indexOf(item.job_id) != -1) {
                } else {
                    new_posts_list.push(item)
                }
            }
        }
        return new_posts_list
    }
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    }
    function applyReplaceTextsSetting(sk_indeed_jobs, html) {
        var texts_to_replace = getDsmSetting(sk_indeed_jobs, "replace_texts")
        if (!texts_to_replace) {
            return html
        }
        var text_to_replace_array = texts_to_replace.split(",")
        for (var i = 0; i < text_to_replace_array.length; i++) {
            if (text_to_replace_array[i].indexOf("=") != -1) {
                var replace_texts = text_to_replace_array[i].split("=")
                var word_to_replace = replace_texts[0]
                var new_word = replace_texts[1]
                if (word_to_replace && new_word) {
                    console.log(word_to_replace, new_word)
                    html = html.split(word_to_replace).join(new_word)
                }
            }
        }
        return html
    }
    function requestFeedData(sk_indeed_jobs) {
        var embed_id = getDsmEmbedId(sk_indeed_jobs)
        var json_url =
            app_file_server_url +
            embed_id +
            ".json?nocache=" +
            new Date().getTime()
        jQuery
            .getJSON(json_url, function (data) {
                original_data = data
                loadFeed(sk_indeed_jobs, "")
            })
            .fail(function (e) {
                generateSolutionMessage(sk_indeed_jobs, embed_id)
            })
    }
    function loadBioInformation(sk_indeed_jobs, data, search_term) {
        var jobs_items = ""
        var region_code = getDsmSetting(sk_indeed_jobs, "region_code")
        if (
            getDsmSetting(sk_indeed_jobs, "show_profile_picture") == 0 &&
            getDsmSetting(sk_indeed_jobs, "show_profile_follow_button") == 0 &&
            getDsmSetting(sk_indeed_jobs, "show_profile_follower_count") == 0 &&
            getDsmSetting(sk_indeed_jobs, "show_profile_name") == 0 &&
            getDsmSetting(sk_indeed_jobs, "show_profile_description") == 0 &&
            getDsmSetting(sk_indeed_jobs, "show_profile_website") == 0 &&
            getDsmSetting(sk_indeed_jobs, "show_address") == 0 &&
            getDsmSetting(sk_indeed_jobs, "show_profile_employees_count") ==
                0 &&
            getDsmSetting(sk_indeed_jobs, "show_profile_employees_count") ==
                0 &&
            getDsmSetting(sk_indeed_jobs, "show_organization_type") == 0
        ) {
        } else {
            var profile_link = ""
            profile_link = data.bio.link
            jobs_items += "<div class='indeed-jobs-user-root-container'>"
            if (getDsmSetting(sk_indeed_jobs, "show_search_box") == 1) {
                jobs_items +=
                    "<div class='sk-search-container' onclick='void(0);'>"
                jobs_items += "<div class='sk_search_element_container'>"
                jobs_items += "<div class='container_sk_ww_input_and_icon'>"
                jobs_items += "<form class='sk_ww_search_facebook_videos_form'>"
                jobs_items +=
                    "<input type='text' class='sk_ww_search_facebook_feed_keyword' placeholder='Search...' value='" +
                    search_term +
                    "'/>"
                if (search_term) {
                    jobs_items +=
                        "<i class='fa fa-times sk_ww_search_icon' aria-hidden='true'></i>"
                } else {
                    jobs_items +=
                        "<i class='fa fa-search sk_ww_search_icon' aria-hidden='true'></i>"
                }
                jobs_items += "</form>"
                jobs_items += "</div>"
                jobs_items += "</div>"
                jobs_items += "</div>"
            }
            if (getDsmSetting(sk_indeed_jobs, "show_profile_picture") == 1) {
                jobs_items += "<div class='indeed-jobs-profile-container'>"
                if (data.bio.profile_picture.startsWith("/")) {
                    data.bio.profile_picture =
                        "https://www.indeed.com" + data.bio.profile_picture
                }
                var bio_profile_picture = data.bio.profile_picture.replace(
                    "64x64",
                    "128x128"
                )
                jobs_items +=
                    "<div class='indeed-jobs-profile-pic' style='background-image:url(" +
                    bio_profile_picture +
                    ");'></div>"
                jobs_items +=
                    "<div class='sk-bio-username username' style='display: none;'>" +
                    data.bio.username +
                    "</div>"
                jobs_items += "</div>"
            }
            jobs_items += "<div class='sk-indeed-jobs-profile-info width-60'>"
            jobs_items += "<div class='sk_facebook_jobs_feed_username_follow'>"
            if (getDsmSetting(sk_indeed_jobs, "show_profile_name") == 1) {
                jobs_items +=
                    "<span class='sk-indeed-jobs-profile-usename'><a class='href_status_trigger_feed' target='_blank' style='text-decoration: none;' href='" +
                    profile_link +
                    "'>" +
                    data.bio.full_name +
                    "</a></span>"
            }
            jobs_items += "</div>"
            if (
                (getDsmSetting(sk_indeed_jobs, "show_organization_type") == 1 &&
                    data.bio.org_type.length > 0) ||
                (getDsmSetting(sk_indeed_jobs, "show_address") == 1 &&
                    data.bio.address.length > 0)
            ) {
                jobs_items += "<div class='sk-indeed-org-type-address'>"
                if (
                    getDsmSetting(sk_indeed_jobs, "show_organization_type") ==
                        1 &&
                    data.bio.org_type.length > 0
                ) {
                    jobs_items +=
                        "<span><span class='f-w-b'>" +
                        data.bio.org_type +
                        "</span>"
                    if (
                        getDsmSetting(sk_indeed_jobs, "show_address") == 1 &&
                        data.bio.address.length > 0
                    ) {
                        jobs_items += " â€¢ </span>"
                    } else {
                        jobs_items += "</span>&nbsp;&nbsp;&nbsp;"
                    }
                }
                if (
                    getDsmSetting(sk_indeed_jobs, "show_address") == 1 &&
                    data.bio.address.length > 0
                ) {
                    jobs_items +=
                        "<span class='f-w-b'>" + data.bio.address + "</span>"
                }
                jobs_items += "</div>"
            }
            jobs_items += "<div class='sk-indeed-jobs-profile-counts'>"
            jobs_items += "<div>"
            if (
                getDsmSetting(sk_indeed_jobs, "show_profile_follower_count") ==
                    1 &&
                data.bio.followers_count
            ) {
                jobs_items +=
                    "<span><span class='f-w-b'>" +
                    formatNumber(data.bio.followers_count) +
                    "</span> Followers"
                if (
                    getDsmSetting(
                        sk_indeed_jobs,
                        "show_profile_employees_count"
                    ) == 1 &&
                    data.bio.number_of_employees.length > 0
                ) {
                    jobs_items += " â€¢ </span>"
                } else {
                    jobs_items += "</span> "
                }
            }
            if (
                getDsmSetting(sk_indeed_jobs, "show_profile_employees_count") ==
                    1 &&
                data.bio.number_of_employees.length > 0
            ) {
                jobs_items +=
                    "<span><span class='f-w-b'>" +
                    data.bio.number_of_employees +
                    "</span> Employees</span> "
            }
            jobs_items += "</div>"
            jobs_items += "</div>"
            jobs_items +=
                "<div class='href_status_trigger_feed_container sk-indeed-jobs-profile-description'>"
            if (
                getDsmSetting(sk_indeed_jobs, "show_profile_description") == 1
            ) {
                jobs_items += data.bio.profile_description
            }
            jobs_items += "</div>"
            if (
                getDsmSetting(sk_indeed_jobs, "show_profile_follow_button") == 1
            ) {
                var follow_button_text = getDsmSetting(
                    sk_indeed_jobs,
                    "follow_button_text"
                )
                follow_button_text = follow_button_text
                    ? follow_button_text
                    : "Follow"
                jobs_items +=
                    "<button type='button' onclick=\"window.open('" +
                    profile_link +
                    "');\" class='indeed-jobs-user-container sk-follow-indeed-btn'>"
                jobs_items +=
                    "<i class='fa fa-plus' aria-hidden='true'></i> " +
                    follow_button_text
                jobs_items += "</button>"
            }
            jobs_items += "</div>"
            jobs_items += "</div>"
        }
        return jobs_items
    }
    function loadFeed(sk_indeed_jobs, search_term) {
        var embed_id = getDsmEmbedId(sk_indeed_jobs)
        var data = original_data
        var no_jobs_text = getDsmSetting(sk_indeed_jobs, "no_jobs_text")
        if (data.user_info && !widgetValidation(sk_indeed_jobs, data)) {
            return
        } else if (!data.posts && !data.bio) {
            generateSolutionMessage(sk_indeed_jobs, embed_id)
            return
        } else {
            var region_code = "www."
            if (
                getDsmSetting(sk_indeed_jobs, "region_code") &&
                getDsmSetting(sk_indeed_jobs, "region_code") != "US"
            ) {
                region_code = getDsmSetting(sk_indeed_jobs, "region_code") + "."
            }
            if (!data.posts) {
                data.posts = []
            }
            original_data = data
            data_bio = data.bio
            data_storage = data.posts
            data_storage = moderationTabFeature(sk_indeed_jobs, data_storage)
            data_storage = orderJobsByMostRecent(sk_indeed_jobs, data_storage)
            if (search_term) {
                data_storage = applySearchFeature(data_storage, search_term)
            }
            if (getDsmSetting(sk_indeed_jobs, "indeed_name_text")) {
                data.bio.full_name = getDsmSetting(
                    sk_indeed_jobs,
                    "indeed_name_text"
                )
            }
            var jobs_items = ""
            jobs_items += loadBioInformation(sk_indeed_jobs, data, search_term)
            if (data.posts && data.posts.length == 0) {
                jobs_items +=
                    "<div class='sk-no-jobs-message'>" + no_jobs_text + "</div>"
            } else if (getDsmSetting(sk_indeed_jobs, "layout") == 3) {
                jobs_items += loadSliderLayout(sk_indeed_jobs, data_storage)
            } else {
                jobs_items += "<div class='grid-indeed-jobs'>"
                jobs_items += "<div class='grid-sizer-indeed-jobs'></div>"
                last_key = parseInt(getDsmSetting(sk_indeed_jobs, "post_count"))
                var enable_button = false
                var jobs_count = getDsmSetting(sk_indeed_jobs, "jobs_count")
                var jobs_length = data.posts.length
                var jobs_counter = 1
                if (jobs_length > 0) {
                    for (var i = 0; i < last_key; i++) {
                        if (typeof data_storage[i] != "undefined") {
                            jobs_items += getFeedItem(
                                data_storage[i],
                                sk_indeed_jobs,
                                data.bio
                            )
                            jobs_counter++
                        }
                    }
                    if (data_storage.length > last_key) {
                        enable_button = true
                    }
                } else {
                    var instructions = no_jobs_text
                    if (
                        typeof data.instructions != "undefined" &&
                        data.instructions
                    ) {
                        instructions = data.instructions
                    }
                    jobs_items +=
                        "<div class='sk-error-message'>" +
                        instructions +
                        "</div>"
                }
                jobs_items += "</div>"
                if (
                    getDsmSetting(sk_indeed_jobs, "show_load_more_button") == 1
                ) {
                    jobs_items +=
                        "<div class='sk-indeed-jobs-bottom-btn-container'>"
                    if (
                        getDsmSetting(
                            sk_indeed_jobs,
                            "show_load_more_button"
                        ) == 1 &&
                        enable_button
                    ) {
                        jobs_items +=
                            "<button type='button' class='sk-indeed-jobs-load-more-jobs'>"
                        jobs_items += getDsmSetting(
                            sk_indeed_jobs,
                            "load_more_posts_text"
                        )
                        jobs_items += "</button><br>"
                    }
                    jobs_items += "</div>"
                }
            }
            jobs_items += skGetBranding(sk_indeed_jobs, data.user_info)
            sk_indeed_jobs.find(".indeed-jobs-user-root-container").remove()
            sk_indeed_jobs.find(".grid-indeed-jobs").remove()
            sk_indeed_jobs.find(".sk-indeed-jobs-bottom-btn-container").remove()
            jobs_items = applyReplaceTextsSetting(sk_indeed_jobs, jobs_items)
            sk_indeed_jobs.append(jobs_items)
            if (getDsmSetting(sk_indeed_jobs, "layout") == 3) {
                skLayoutSliderSetting(sk_indeed_jobs)
                skLayoutSliderArrowUI(sk_indeed_jobs)
            }
            sk_indeed_jobs
                .find(".jobs-content")
                .find("a")
                .attr("target", "_blank")
            if (jobs_length < 1) {
                sk_indeed_jobs
                    .find(".grid-indeed-jobs")
                    .css({ height: "40px", "text-align": "center" })
            } else {
                fixMasonry()
            }
            applyCustomUi(jQuery, sk_indeed_jobs)
            applyMasonry()
            sk_increaseView(data.user_info)
            addDescriptiveTagAttributes(sk_indeed_jobs)
        }
    }
    function mediaItem(val) {
        var jobs_items = ""
        jobs_items += "<div class='sk_jobs_media '>"
        var media_content = ""
        var multiple_photos = ""
        var media_content_trigger = ""
        if (
            val.embed_source &&
            val.embed_source.includes("indeed.com") == true &&
            val.images &&
            val.images.length > 0
        ) {
            jobs_items +=
                "<a href='" +
                val.embed_source +
                "' target='_blank' ><image class='sk-width-100p' src='" +
                val.images[0] +
                "'/></a>"
        } else if (
            val.embed_source &&
            val.embed_source.includes("indeed.com") == true &&
            val.images == null
        ) {
            jobs_items += "<iframe src='" + val.embed_source + "?compact=1'"
            jobs_items +=
                " style='min-height:195px;' width='100%' frameborder='0' allowfullscreen='' title='Embedded jobs'></iframe>"
        } else if (
            val.embed_source &&
            val.embed_source.includes("indeed.com") == false
        ) {
            if (val.embed_source.includes("vimeo.com")) {
                val.embed_source =
                    "https://player.vimeo.com/video/" +
                    val.embed_source.substring(
                        val.embed_source.lastIndexOf("/") + 1
                    )
            }
            var embed_source = val.embed_source
            if (embed_source.indexOf("youtu") != -1) {
                embed_source = embed_source.replace(
                    "https://www.youtube.com/watch?v=",
                    "https://www.youtube.com/embed/"
                )
                embed_source = embed_source.replace(
                    "https://youtu.be/",
                    "https://www.youtube.com/embed/"
                )
                if (embed_source.indexOf("&") != -1) {
                    embed_source = embed_source.substring(
                        0,
                        embed_source.indexOf("&")
                    )
                }
            }
            jobs_items += "<iframe src='" + embed_source + "'"
            jobs_items +=
                "height='400' width='100%' frameborder='0' allowfullscreen='' title='Embedded jobs'></iframe>"
        } else if (val.video_url) {
            jobs_items += "<div class='sk_video_holder'>"
            jobs_items +=
                "<div class='sk_play_button'><i class='fa fa-play-circle' aria-hidden='true'></i></div>"
            jobs_items +=
                "<video class='sk_jobs_img sk_indeed_video display-none' controls>"
            jobs_items +=
                "<source src='" + val.video_url + "' type='video/mp4'>"
            jobs_items += "Your browser does not support the video tag."
            jobs_items += "</video>"
            jobs_items +=
                "<image class='sk_jobs_img' src='" + val.thumbnail + "'/>"
            jobs_items += "</div>"
        } else if (val.images && val.images.length > 0 && !val.jobs_url) {
            var sk_hidden_in_pop_up = ""
            var plus = ""
            if (val.images.length > 0) {
                plus = "4+"
            }
            if (val.images.length > 1)
                sk_hidden_in_pop_up = "sk_jobs_img-popup-hidden"
            if (val.images.length > 1) {
                if (val.images.length == 2) {
                    var media_attachments = val.images.slice(0, 2)
                    jobs_items +=
                        "<div class='" +
                        sk_hidden_in_pop_up +
                        " photo-grid-2 sk_jobs_type_photo'>"
                    jQuery.each(media_attachments, function (i, v) {
                        jobs_items += "<div class='image-item'>"
                        jobs_items +=
                            "<img src='" + v + "' class='sk_jobs_img' />"
                        jobs_items += "</div>"
                    })
                    jobs_items += "</div>"
                } else if (val.images.length == 3) {
                    var media_attachments = val.images.slice(0, 3)
                    jQuery.each(media_attachments, function (i, v) {
                        if (i == 0) {
                            jobs_items +=
                                "<div class='three_photo " +
                                sk_hidden_in_pop_up +
                                " photo-grid-3 sk_jobs_type_photo'>"
                            jobs_items += "<div class='image-item'>"
                            jobs_items +=
                                "<img src='" +
                                v +
                                "' class='sk_jobs_img first-image' />"
                            jobs_items += "</div>"
                            jobs_items += "</div>"
                        }
                    })
                    jobs_items +=
                        "<div class='" +
                        sk_hidden_in_pop_up +
                        " photo-grid-2 sk_jobs_type_photo'>"
                    jQuery.each(media_attachments, function (i, v) {
                        if (i != 0) {
                            jobs_items += "<div class='image-item'>"
                            jobs_items +=
                                "<img src='" + v + "' class='sk_jobs_img' />"
                            jobs_items += "</div>"
                        }
                    })
                    jobs_items += "</div>"
                } else if (val.images.length >= 4) {
                    var media_attachments = val.images.slice(0, 4)
                    jobs_items +=
                        "<div class='" +
                        sk_hidden_in_pop_up +
                        " photo-grid-2 sk_jobs_type_photo'>"
                    jQuery.each(media_attachments, function (i, v) {
                        if (i == 3)
                            jobs_items +=
                                "<div style='position: relative; display: inline-block;' class='image-item'>"
                        else jobs_items += "<div class='image-item'>"
                        jobs_items +=
                            "<img src='" + v + "' class='sk_jobs_img' />"
                        if (i == 3 && val.images.length > 4) {
                            jobs_items +=
                                "<div class='img-count'> " + plus + " </div>"
                        }
                        jobs_items += "</div>"
                    })
                    jobs_items += "</div>"
                }
                var media_attachments = val.images
                media_content_trigger = "media_content_trigger"
                multiple_photos +=
                    '<div class="swiper-container swiper-container-single">'
                multiple_photos += '<div class="swiper-wrapper">'
                jQuery.each(media_attachments, function (index, value) {
                    multiple_photos +=
                        "<div class='swiper-slide'><img class='sk_jobs_img' style='width: 100%; margin: 0px !important;' src='" +
                        value +
                        "'/></div>"
                })
                multiple_photos += "</div>"
                multiple_photos +=
                    '<div class="swiper-button-next-single"><i class="mfp-arrow mfp-arrow-right"></i></div>'
                multiple_photos +=
                    '<div class="swiper-button-prev-single"><i class="mfp-arrow mfp-arrow-left"></i></div>'
                multiple_photos += "</div>"
                jobs_items +=
                    "<div class='multiple_photos'>" + multiple_photos + "</div>"
            } else if (val.images.length == 1) {
                jobs_items +=
                    "<image class='sk_jobs_img " +
                    sk_hidden_in_pop_up +
                    "' src='" +
                    val.images[0] +
                    "'/>"
            }
        } else if (val.jobs_url) {
            val.id = val.id.replace("&", "and_sign")
            val.id = val.id.replace(".", "dot")
            jobs_items += "<div id='meta_holder_" + val.id + "'></div>"
        } else if (val.thumbnail) {
            jobs_items +=
                "<image class='sk_jobs_img' src='" + val.thumbnail + "'/>"
        }
        jobs_items += "</div>"
        return jobs_items
    }
    function getFeedItem(val, sk_indeed_jobs, bio) {
        var jobs_items = ""
        var profile_link = bio.link
        var show_post_profile_name = getDsmSetting(
            sk_indeed_jobs,
            "show_post_profile_name"
        )
        var show_post_profile_image = getDsmSetting(
            sk_indeed_jobs,
            "show_post_profile_image"
        )
        var show_jobs_icon = getDsmSetting(sk_indeed_jobs, "show_post_icon")
        var show_jobs_date = getDsmSetting(sk_indeed_jobs, "show_post_date")
        var show_pop_up = getDsmSetting(sk_indeed_jobs, "show_pop_up")
        var profile_name_display = ""
        var job_link = val.job_link ? val.job_link : val.link
        jobs_items +=
            "<div   class='grid-item-indeed-jobs grid-item-indeed-jobs-" +
            val.id +
            "'>"
        jobs_items += "<div class='grid-content'>"
        jobs_items += "<div class='sk-job-item-content-container'>"
        jobs_items += "<div class='sk-job-title-container'>"
        jobs_items +=
            "<a href='" +
            job_link +
            "' target='_blank' class='href_status_trigger_jobs_container'>"
        jobs_items += val.job_title
        jobs_items += "</a>"
        jobs_items += "</div>"
        jobs_items += "<div class='sk-jobs-details-container'>"
        jobs_items += "<div class='jobs-content' data-link='" + job_link + "'>"
        jobs_items += "<div class='sk-jobs-content-body'>"
        if (getDsmSetting(sk_indeed_jobs, "show_company_name") == 1) {
            jobs_items +=
                "<div class='href_status_trigger_jobs_container sk-jobs-text-padding'>"
            jobs_items += val.company
            jobs_items += "</div>"
        }
        jobs_items +=
            "<div class='href_status_trigger_jobs_container sk-jobs-text-padding'>"
        jobs_items += val.location
        jobs_items += "</div>"
        jobs_items +=
            "<div class='href_status_trigger_jobs_container sk-jobs-text-padding'>"
        if (getDsmSetting(sk_indeed_jobs, "show_hiring_rate") == 1) {
            jobs_items += val.notice
        }
        if (show_jobs_date == 1 && val.ago_value) {
            var ago_num = parseInt(val.ago_value)
            if (
                val.ago_value &&
                getDsmSetting(sk_indeed_jobs, "month_ago_text")
            ) {
                val.ago_value = val.ago_value.replace(
                    "months ago",
                    getDsmSetting(sk_indeed_jobs, "month_ago_text")
                )
                val.ago_value = val.ago_value.replace(
                    "month ago",
                    getDsmSetting(sk_indeed_jobs, "month_ago_text")
                )
            }
            if (
                val.ago_value &&
                getDsmSetting(sk_indeed_jobs, "week_ago_text")
            ) {
                val.ago_value = val.ago_value.replace(
                    "week ago",
                    getDsmSetting(sk_indeed_jobs, "week_ago_text")
                )
                val.ago_value = val.ago_value.replace(
                    "weeks ago",
                    getDsmSetting(sk_indeed_jobs, "week_ago_text")
                )
            }
            if (
                val.ago_value &&
                getDsmSetting(sk_indeed_jobs, "day_ago_text")
            ) {
                val.ago_value = val.ago_value.replace(
                    "day ago",
                    getDsmSetting(sk_indeed_jobs, "day_ago_text")
                )
                val.ago_value = val.ago_value.replace(
                    "days ago",
                    getDsmSetting(sk_indeed_jobs, "day_ago_text")
                )
            }
            if (
                val.ago_value &&
                getDsmSetting(sk_indeed_jobs, "hour_ago_text")
            ) {
                val.ago_value = val.ago_value.replace(
                    "hours ago",
                    getDsmSetting(sk_indeed_jobs, "hour_ago_text")
                )
                val.ago_value = val.ago_value.replace(
                    "hour ago",
                    getDsmSetting(sk_indeed_jobs, "hour_ago_text")
                )
            }
            if (val.ago_value.indexOf("%num%") != -1) {
                val.ago_value = val.ago_value.replace(ago_num, "")
            }
            val.ago_value = val.ago_value.replace("%num%", ago_num)
            jobs_items += "<span class='sk-jobs-ago-text'>"
            jobs_items +=
                "<i class='fa fa-clock' aria-hidden='true'></i> " +
                val.ago_value
            jobs_items += "</span>"
        }
        jobs_items += "</div>"
        if (
            val.shared_jobs_owner_name != undefined &&
            val.shared_jobs_owner_name != null &&
            val.shared_jobs_owner_name != ""
        ) {
            var shared_jobs_header = ""
            if (val.shared_jobs_owner_picture.length < 1) {
                val.shared_jobs_owner_picture =
                    app_url + "images/li_default_dp.PNG"
            }
            shared_jobs_header += "<div class='jobs-image'>"
            var m_top = 0
            if (val.shared_jobs_owner_description != "") {
                m_top = 5
            }
            shared_jobs_header +=
                "<img style='margin-top:" +
                m_top +
                "px;' src='" +
                val.shared_jobs_owner_picture +
                "' class='img-thumbnail'>"
            shared_jobs_header += "</div>"
            shared_jobs_header += "<div class='sk-fb-page-name'>"
            shared_jobs_header +=
                "<strong " +
                profile_name_display +
                "><label class='href_status_trigger_jobs profile-name'>" +
                val.shared_jobs_owner_name +
                "</label></strong> "
            shared_jobs_header += "<div><span class='sk-secondary-data'>"
            shared_jobs_header += val.shared_jobs_date
            shared_jobs_header +=
                "<div class='sk-indeed-shared-jobs-owner-description'>" +
                val.shared_jobs_owner_description +
                "</div>"
            shared_jobs_header += "</span></div>"
            shared_jobs_header += "</div>"
            shared_jobs_header += "</div>"
            jobs_items += shared_jobs_header
            jobs_items +=
                "<div class='href_status_trigger_jobs_container sk-jobs-text sk-jobs-text-" +
                val.id +
                "'>"
            jobs_items += val.shared_jobs_description
            jobs_items += "</div>"
            jobs_items += mediaItem(val)
            jobs_items += "</div>"
        } else {
            jobs_items += mediaItem(val)
        }
        jobs_items += "</div>"
        jobs_items += "</div>"
        jobs_items += "<div class='jobs-jobs-counts'>"
        jobs_items +=
            "<button type='button' data-link='" +
            job_link +
            "' class='indeed-jobs-user-container sk-btn-apply-now'>"
        let apply_now_text = getDsmSetting(sk_indeed_jobs, "apply_now_text")
            ? getDsmSetting(sk_indeed_jobs, "apply_now_text")
            : "Apply now"
        jobs_items += apply_now_text
        jobs_items += "</button>"
        if (show_jobs_icon == 1) {
            jobs_items +=
                "<span class='sk-indeed-jobs-m-l-15px sk_jobs_view_on_facebook'>"
            jobs_items +=
                "<a class='href_status_trigger_jobs sk-indeed-logo' data-link='" +
                job_link +
                "' target='_blank' title='" +
                getDsmSetting(sk_indeed_jobs, "view_on_facebook_text") +
                "'>"
            jobs_items += "<i class='fa fa-indeed' aria-hidden='true'></i> "
            jobs_items += "</a>"
            jobs_items += "</span>"
        }
        jobs_items += "</div>"
        jobs_items += "</div>"
        jobs_items += "</div>"
        jobs_items += "</div>"
        if (getDsmSetting(sk_indeed_jobs, "show_pop_up") == 1) {
            jobs_items +=
                "<div class='white-popup mfp-hide sk-popup-container'>"
            jobs_items += "<div class='sk-popup-media'>"
            jobs_items += mediaItem(val)
            jobs_items += "</div>"
            jobs_items += "<div class='sk-popup-details'>"
            jobs_items += "<div class='sk-popup-details-body'>"
            jobs_items +=
                "<div class='href_status_trigger_jobs_container sk-mt-10'>"
            jobs_items += "<b>" + val.job_title + "</b>"
            jobs_items += "</div>"
            if (getDsmSetting(sk_indeed_jobs, "show_company_name") == 1) {
                jobs_items +=
                    "<div class='href_status_trigger_jobs_container sk-mt-10'>"
                jobs_items += val.company
                jobs_items += "</div>"
            }
            jobs_items +=
                "<div class='href_status_trigger_jobs_container sk-mt-10'>"
            jobs_items += val.location
            jobs_items += "</div>"
            jobs_items +=
                "<div class='href_status_trigger_jobs_container job-details sk-mt-10'>"
            if (getDsmSetting(sk_indeed_jobs, "show_hiring_rate") == 1) {
                jobs_items += "<small>" + val.notice + "</small>"
            }
            if (show_jobs_date == 1 && val.ago_value) {
                jobs_items += "<span>"
                jobs_items += "<small>" + val.ago_value + "</small>"
                jobs_items += "</span>"
            }
            jobs_items += "<div class='sk-job-description'>"
            jobs_items += val.description
            jobs_items += "</div>"
            jobs_items += "</div>"
            jobs_items +=
                "<button type='button' data-link='" +
                job_link +
                "' class='indeed-jobs-user-container sk-btn-apply-now'>"
            let apply_now_text = getDsmSetting(sk_indeed_jobs, "apply_now_text")
                ? getDsmSetting(sk_indeed_jobs, "apply_now_text")
                : "Apply now"
            jobs_items += apply_now_text
            jobs_items += "</button>"
            jobs_items += "</div>"
            jobs_items += "</div>"
            jobs_items += "</div>"
        }
        jobs_items += "</div>"
        return jobs_items
    }
    function applyMasonry() {
        $grid = new Masonry(".grid-indeed-jobs", {
            itemSelector: ".grid-item-indeed-jobs",
            columnWidth: ".grid-sizer-indeed-jobs",
            percentPosition: true,
            transitionDuration: 0,
        })
        var sk_indeed_jobs = jQuery(".sk-ww-indeed-jobs")
        if (sk_indeed_jobs.find(".sk-error-message").length) {
            sk_indeed_jobs.find(".sk-error-message").css("height", "40px")
            sk_indeed_jobs
                .find(".sk-error-message")
                .closest(".grid-indeed-jobs")
                .css("height", "40px")
        }
    }
    function fixMasonry() {
        setTimeout(function () {
            applyMasonry()
        }, 500)
        setTimeout(function () {
            applyMasonry()
        }, 1000)
        setTimeout(function () {
            applyMasonry()
        }, 2000)
        setTimeout(function () {
            applyMasonry()
        }, 3000)
        setTimeout(function () {
            applyMasonry()
        }, 4000)
        setTimeout(function () {
            applyMasonry()
        }, 5000)
        setTimeout(function () {
            applyMasonry()
        }, 6000)
        setTimeout(function () {
            applyMasonry()
        }, 7000)
        setTimeout(function () {
            applyMasonry()
        }, 8000)
    }
    function loadSliderLayout(sk_indeed_jobs, data) {
        var column_count = getDsmSetting(sk_indeed_jobs, "column_count")
        column_count = parseInt(column_count)
        if (jQuery(document).width() < 480) {
            column_count = 1
        } else if (jQuery(document).width() < 750) {
            column_count = column_count > 2 ? 2 : column_count
        } else if (jQuery(document).width() <= 750) {
            column_count = column_count > 2 ? 2 : column_count
        } else {
            column_count = getDsmSetting(sk_indeed_jobs, "column_count")
            column_count = parseInt(column_count)
        }
        var jobs_items = ""
        jobs_items += "<div class='swiper-container swiper-layout-slider'>"
        jobs_items +=
            "<button type='button' class='swiper-button-next ' style='pointer-events: all;'>"
        jobs_items += "<i class='sk-arrow sk-arrow-right'></i>"
        jobs_items += "</button>"
        jobs_items +=
            "<button type='button' class='swiper-button-prev' style='pointer-events: all;'>"
        jobs_items += "<i class='sk-arrow sk-arrow-left'></i>"
        jobs_items += "</button>"
        jobs_items += "<div class='swiper-wrapper'>"
        var last_index = 0
        var data_slider = data
        var pages = Math.ceil(data_slider.length / column_count)
        for (var slide = 1; slide <= pages; slide++) {
            jobs_items += "<div class='swiper-slide' >"
            jobs_items += "<div class='grid-indeed-jobs'>"
            jobs_items += "<div class='grid-sizer-indeed-jobs'></div>"
            var slide_data = getPaginationResult(
                sk_indeed_jobs,
                data_slider,
                slide,
                column_count
            )
            jQuery.each(slide_data, function (key, val) {
                if (typeof val != "undefined")
                    jobs_items += getFeedItem(val, sk_indeed_jobs, data_bio)
            })
            jobs_items += "</div>"
            jobs_items += "</div>"
        }
        jobs_items +=
            "<input type='hidden' value=" +
            data_slider.length +
            " class='indeed-jobs-length'>"
        jobs_items += "</div>"
        jobs_items += "</div>"
        return jobs_items
    }
    function getPaginationResult(
        sk_indeed_jobs,
        jobs_data,
        page,
        column_count
    ) {
        var start = 0
        var end = parseInt(column_count)
        var multiplicand = page - 1
        var return_jobs_data = []
        if (page != 1) {
            start = multiplicand * end
            end = start + end
        }
        if (end - 1 > jobs_data.length) {
            end = jobs_data.length
        }
        for (var i = start; i < end; i++) {
            return_jobs_data.push(jobs_data[i])
        }
        return return_jobs_data
    }
    function skLayoutSliderSetting(sk_indeed_jobs) {
        var autoplay = false
        var loop = false
        if (getDsmSetting(sk_indeed_jobs, "autoplay") == 1) {
            var delay = getDsmSetting(sk_indeed_jobs, "delay") * 1500
            autoplay = { delay: delay }
            loop = true
        }
        var swiper = new Swiper(".swiper-layout-slider.swiper-container", {
            loop: loop,
            autoplay: autoplay,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        })
    }
    function skLayoutSliderHeight(sk_indeed_jobs) {
        var thisH = 0
        var maxHeight = 0
        var thisHC = 0
        var maxHeightC = 0
        var slider_active = sk_indeed_jobs.find(".swiper-slide-active")
        var slider_next = sk_indeed_jobs.find(".swiper-slide-next")
        var slider_first = sk_indeed_jobs.find("div.swiper-slide-1")
        var slider_duplicate = sk_indeed_jobs.find("div.swiper-slide-duplicate")
        if (slider_active.length == 0) {
            slider_active = slider_duplicate
        }
        slider_next = slider_active
        maxHeight = slider_next.find(".grid-indeed-jobs").height()
        slider_next.css({ height: maxHeight + "px" })
        slider_next
            .find(".sk_fb_page_reviews_grid")
            .css({ height: maxHeight + "px" })
        sk_indeed_jobs.find(".swiper-wrapper").css({ height: "auto" })
        var feed_height = sk_indeed_jobs.find(".swiper-layout-slider").height()
        sk_indeed_jobs.css({ width: 100 + "%", height: "auto" })
        var feed_height_2 = feed_height / 2
        sk_indeed_jobs
            .find(".swiper-button-prev,.swiper-button-next")
            .css({ top: feed_height_2 + "px" })
    }
    function hoverContent(sk_indeed_jobs) {
        sk_indeed_jobs
            .find(".grid-indeed-jobs")
            .find(".jobs-content")
            .mouseover(function () {
                var container_height = jQuery(this)
                    .find(".sk-jobs-content-body")
                    .height()
                if (jQuery(this).height() < container_height) {
                    jQuery(this).css({ "overflow-y": "auto" })
                }
            })
            .mouseout(function () {
                jQuery(this).css({ "overflow-y": "hidden" })
            })
        jQuery(".mfp-content")
            .find(".white-popup")
            .find(".jobs-content")
            .css({ overflow: "unset" })
    }
    function skLayoutSliderArrowUI(sk_indeed_jobs) {
        var post_height = getDsmSetting(sk_indeed_jobs, "post_height")
        if (post_height == 0) {
            post_height = 400
        }
        if (post_height > 0) {
            sk_indeed_jobs
                .find(".grid-content")
                .find(".jobs-content")
                .css("height", post_height + "px")
            setPostsHeight(sk_indeed_jobs)
        }
        var arrow_background_color = getDsmSetting(
            sk_indeed_jobs,
            "arrow_background_color"
        )
        var arrow_color = getDsmSetting(sk_indeed_jobs, "arrow_color")
        var arrow_opacity = getDsmSetting(sk_indeed_jobs, "arrow_opacity")
        sk_indeed_jobs
            .find(".swiper-button-prev i,.swiper-button-next i")
            .mouseover(function () {
                jQuery(this).css({
                    opacity: "1",
                    "border-color": arrow_background_color,
                })
            })
            .mouseout(function () {
                jQuery(this).css({
                    "border-color": arrow_color,
                    opacity: arrow_opacity,
                })
            })
        sk_indeed_jobs
            .find(".swiper-button-prev i,.swiper-button-next i")
            .css({
                "border-color": arrow_color,
                opacity: arrow_opacity,
                color: arrow_color,
            })
        sk_indeed_jobs
            .find(".swiper-button-spinner")
            .css({ color: arrow_color })
        var items = jQuery(".sk-job-title-container")
        setTimeout(function () {
            var maxHeight = 0
            for (var i = 0; i < items.length; i++) {
                if (
                    maxHeight <
                    jQuery(jQuery(".sk-job-title-container")[i]).height()
                ) {
                    maxHeight = jQuery(
                        jQuery(".sk-job-title-container")[i]
                    ).height()
                }
            }
            if (maxHeight > 0) {
                sk_indeed_jobs
                    .find(".sk-job-title-container")
                    .css("height", maxHeight + "px")
            }
        }, 500)
        skLayoutSliderHeight(sk_indeed_jobs)
    }
    function showPopUp(
        jQuery,
        content_src,
        clicked_element,
        sk_linkedin_page_post
    ) {
        jQuery(".sk_selected_reviews").removeClass("sk_selected_reviews")
        jQuery(".prev_sk_google_review").remove()
        jQuery(".next_sk_google_review").remove()
        clicked_element.addClass("sk_selected_reviews")
        if (typeof jQuery.magnificPopup === "undefined")
            initManificPopupPlugin(jQuery)
        jQuery.magnificPopup.open({
            items: { src: content_src },
            type: "inline",
            callbacks: {
                open: function () {
                    var post_html = ""
                    if (
                        clicked_element.prev(".grid-item-indeed-jobs").length >
                            0 &&
                        clicked_element
                            .prev(".grid-item-indeed-jobs")
                            .find(".sk-popup-container").length > 0
                    ) {
                        post_html += "<button class='prev_sk_google_review'>"
                        post_html +=
                            "<i class='fa arrow-fa fa-chevron-left sk_prt_4px' aria-hidden='true'></i>"
                        post_html += "</button>"
                    }
                    if (clicked_element.next().length > 0) {
                        post_html += "<button class='next_sk_google_review'>"
                        post_html +=
                            "<i class='fa arrow-fa fa-chevron-right sk_plt_4px' aria-hidden='true'></i>"
                        post_html += "</button>"
                    }
                    jQuery(".mfp-content").find(".mfp-close").remove()
                    jQuery(".mfp-content").prepend(
                        '<button title="Close (Esc)" type="button" class="mfp-close" style="right: 0px;">Ã—</button>'
                    )
                    jQuery(".mfp-content")
                        .find(".mfp-close")
                        .css({
                            right:
                                parseInt(
                                    jQuery(".mfp-content")
                                        .find(".white-popup")
                                        .css("marginRight")
                                ) -
                                10 +
                                "px",
                        })
                    jQuery(".mfp-content").prepend(post_html)
                    jQuery(".mfp-content")
                        .find(".next_sk_google_review")
                        .css({
                            right:
                                parseInt(
                                    jQuery(".mfp-content")
                                        .find(".white-popup")
                                        .css("marginRight")
                                ) -
                                30 +
                                "px",
                        })
                    jQuery(".mfp-content")
                        .find(".prev_sk_google_review")
                        .css({
                            left:
                                parseInt(
                                    jQuery(".mfp-content")
                                        .find(".white-popup")
                                        .css("marginRight")
                                ) -
                                30 +
                                "px",
                        })
                    jQuery(
                        ".prev_sk_google_review, .next_sk_google_review"
                    ).css({
                        padding: "0",
                        position: " absolute",
                        top: " 45%",
                        "font-size": " 20px",
                        opacity: " 0.3",
                        cursor: " pointer",
                        "background-color": " transparent",
                        color: " #fff",
                        width: " 35px",
                        height: " 35px",
                        "text-align": " center",
                        "border-radius": " 50%",
                        "vertical-align": " middle",
                        border: "none",
                        outline: "none",
                        "z-index": " 1046",
                        opacity: ".8",
                    })
                    if (jQuery(document).width() < 820) {
                        jQuery(".sk-popup-container").css({
                            "max-width": "75%",
                        })
                        jQuery(".mfp-content")
                            .find(".next_sk_google_review")
                            .css({ right: "0" })
                        jQuery(".mfp-content")
                            .find(".prev_sk_google_review")
                            .css({ left: "0" })
                        jQuery(".mfp-content")
                            .find(".mfp-close")
                            .css({ right: 47 + "px" })
                    }
                    if (jQuery(document).width() < 520) {
                        jQuery(".mfp-content")
                            .find(".mfp-close")
                            .css({ right: 17 + "px" })
                    }
                },
                close: function () {
                    jQuery("video").each(function () {
                        jQuery(this)[0].pause()
                    })
                },
            },
        })
    }
    function initializeSwiperSingleSLider(clicked_element) {
        var singleSwiper = new Swiper(".swiper-container-single", {
            slidesPerView: 1,
            spaceBetween: 30,
            effect: "fade",
            autoplay: 3000,
            pagination: { el: ".swiper-pagination", clickable: true },
            navigation: {
                nextEl: ".swiper-button-next-single",
                prevEl: ".swiper-button-prev-single",
            },
        })
        jQuery(".mfp-content")
            .find(
                ".swiper-container-single .swiper-button-next-single,.swiper-container-single .swiper-button-prev-single"
            )
            .css({
                top: "50%",
                width: "35px",
                height: "35px",
                "background-image": "none",
                "background-color": "transparent",
                color: "white",
                "text-align": "center",
                opacity: "0.7",
                "border-radius": "50%",
            })
        var h = jQuery(
            ".swiper-container-single .swiper-slide-active img,.swiper-container-single .swiper-slide-active video"
        ).innerHeight()
        jQuery(".swiper-container-single").css("height", h + "px")
        jQuery(".swiper-container-single .swiper-slide-active").css(
            "width",
            "100%"
        )
        jQuery(".swiper-layout-slider .swiper-slide-active").css(
            "width",
            "100%"
        )
        if (
            jQuery(document).width() > 750 &&
            jQuery(".mfp-content .swiper-container-single").length > 0
        ) {
            jQuery(
                ".mfp-content .swiper-button-next-single, .mfp-content .swiper-button-prev-single"
            ).on("click", function () {
                var content_height = jQuery(".mfp-content")
                    .find(".swiper-slide-active")
                    .find("img")
                    .height()
                if (jQuery(".white-popup").height() < 320) {
                    content_height += 150
                }
                var containers = jQuery(
                    ".mfp-content, .mfp-content .white-popup,.mfp-content .post-content,.mfp-content .swiper-container, .mfp-content .sk_post_media"
                )
                containers.css({ height: content_height + "px" })
                setTimeout(() => {
                    content_height
                }, 1000)
                setTimeout(() => {
                    content_height
                }, 1500)
                setTimeout(() => {
                    content_height
                }, 2200)
            })
        } else if (
            jQuery(document).width() <= 750 &&
            jQuery(".mfp-content .swiper-container-single").length > 0
        ) {
            jQuery(
                ".mfp-content .swiper-button-next-single, .mfp-content .swiper-button-prev-single"
            ).on("click", function () {
                jQuery(".mfp-content .swiper-container").css({
                    height:
                        jQuery(".mfp-content")
                            .find(".swiper-slide-active")
                            .find("img")
                            .height() + "px",
                })
                popUpDesktopView(sk_linkedin_page_post)
            })
        } else if (jQuery(document).width() <= 750) {
            jQuery(".mfp-content .white-popup,.mfp-content .white-popup").css({
                height: jQuery(".sk_post_img ").height() + "px",
            })
            jQuery(".mfp-content .post-post-counts").css({ bottom: "20px" })
        }
        jQuery(".mfp-content")
            .find(".sk-post-text-new")
            .css("word-break", "break-word")
    }
    function popUpDesktopView(sk_linkedin_page_post) {
        var sk_post_media = jQuery(".mfp-content").find(".sk_post_media")
        var offset_px = 20
        if (jQuery(document).width() > 780) {
            offset_px = 35
        }
        var header = jQuery(".mfp-content").find(".post-header")
        var description_container = jQuery(".mfp-content").find(
            ".href_status_trigger_post_container"
        )
        var description_position = 0
        if (header.length > 0) {
            description_position = header[0].offsetHeight
        }
        description_container.css({ top: description_position + "px" })
        jQuery(".mfp-content")
            .find(".sk-post-text-new")
            .css({
                right: "0px",
                "padding-left": "10px",
                "padding-right": "10px",
                top: description_position + "px",
            })
        setTimeout(function () {
            var post_image_height =
                jQuery(".mfp-content").find(".sk_post_img")[0].offsetHeight
            if (jQuery(".mfp-content").find(".multiple_photos").length > 0)
                post_image_height = jQuery(".mfp-content")
                    .find(".multiple_photos")
                    .find(".sk_post_img")[0].height
            var active_slide = jQuery(".mfp-content").find(
                ".swiper-slide-active"
            )
            description_container.css({ height: "auto" })
            if (
                active_slide.length > 1 &&
                description_position +
                    description_container[0].offsetHeight +
                    15 >
                    post_image_height &&
                post_image_height > 0
            ) {
                var height =
                    jQuery(".mfp-content").find(".sk_post_img")[0]
                        .offsetHeight /
                        2 -
                    15
                description_container.css({
                    height: height + "px",
                    "overflow-y": "auto",
                    "overflow-x": "hidden",
                })
            } else if (active_slide.length > 0) {
                if (
                    description_position +
                        description_container[0].offsetHeight +
                        15 >
                    active_slide[0].offsetHeight
                ) {
                    var height = ""
                    if (active_slide.length > 0)
                        height = active_slide[0].offsetHeight / 2 - 15
                    description_container.css({
                        height: height + "px",
                        "overflow-y": "auto",
                        "overflow-x": "hidden",
                    })
                }
            } else {
                var height =
                    jQuery(".mfp-content").find(".sk_post_img")[0]
                        .offsetHeight /
                        2 -
                    15
                description_container.css({
                    height: height + "px",
                    "overflow-y": "auto",
                    "overflow-x": "hidden",
                })
            }
            jQuery(".mfp-content")
                .find(".multiple_photos")
                .css({ display: "block" })
            jQuery(".mfp-container")
                .find(".mfp-content")
                .find(".sk_post_img-popup-hidden")
                .css({ display: "none" })
            var item_height =
                jQuery(".mfp-content").find(".sk_post_img")[0].offsetHeight
            if (jQuery(".mfp-content").find(".multiple_photos").length > 0)
                item_height = jQuery(".mfp-content")
                    .find(".multiple_photos")
                    .find(".sk_post_img")[0].height
            var post_count_position = 0
            if (header.length > 0) {
                post_count_position = header[0].offsetHeight
            }
            if (description_container.length > 0) {
                post_count_position =
                    post_count_position + description_container[0].offsetHeight
            }
            jQuery(".mfp-content")
                .find(".white-popup")
                .css({ height: item_height })
            jQuery(".mfp-content").css({ height: item_height + "px" })
            if (jQuery(".mfp-content").find(".white-popup").height() < 250) {
                jQuery(".mfp-content")
                    .find(".white-popup, .sk_post_media")
                    .css({ height: "200px" })
                jQuery(".mfp-content")
                    .find(".white-popup")
                    .find(".sk_post_media")
                    .css({ "background-color": "black" })
                var content_height =
                    jQuery(".mfp-content").find(".white-popup").height() + 100
                var containers = jQuery(
                    ".mfp-content, .mfp-content .white-popup,.mfp-content .post-content,.mfp-content .swiper-container,.mfp-content .sk_post_media,.mfp-content .sk_post_media img"
                )
                containers.css({ height: content_height + "px" })
                setTimeout(() => {
                    containers.css({ height: content_height + "px" })
                }, 1000)
                setTimeout(() => {
                    containers.css({ height: content_height + "px" })
                }, 1500)
                setTimeout(() => {
                    containers.css({ height: content_height + "px" })
                }, 2200)
            }
        }, 50)
    }
    var adjustPopUpWhenVid = function () {
        var i = 0
        while (i < 500) {
            ;(function (i) {
                setTimeout(function () {
                    if (jQuery(".mfp-content  video").length > 0) {
                        jQuery(".mfp-content")
                            .find(".white-popup, .mfp-content")
                            .css({
                                height: jQuery(".mfp-content  video")[0]
                                    .clientHeight,
                            })
                    }
                }, 200 * i)
            })(i++)
        }
    }
    function setLineHeight(sk_linkedin_page_post) {
        sk_linkedin_page_post
            .find(".sk-popup-container .feed-shared-text")
            .css({ "line-height": "1.6" })
    }
    function makeResponsive(jQuery, sk_indeed_jobs) {
        var sk_indeed_jobs_width = sk_indeed_jobs.width()
        var grid_sizer_item = 33
        if (sk_indeed_jobs_width <= 320) {
            grid_sizer_item = 100
        } else if (sk_indeed_jobs_width <= 481) {
            grid_sizer_item = 100
        } else if (sk_indeed_jobs_width <= 641) {
            if (getDsmSetting(sk_indeed_jobs, "column_count") == 1) {
                grid_sizer_item = 100
            } else {
                grid_sizer_item = 50
            }
        } else if (sk_indeed_jobs_width <= 750) {
            if (getDsmSetting(sk_indeed_jobs, "column_count") == 1) {
                grid_sizer_item = 100
            } else if (
                getDsmSetting(sk_indeed_jobs, "column_count") == 2 ||
                getDsmSetting(sk_indeed_jobs, "layout") == 3
            ) {
                grid_sizer_item = 50
            } else {
                grid_sizer_item = 33
            }
        } else {
            if (getDsmSetting(sk_indeed_jobs, "column_count") == 1) {
                grid_sizer_item = 100
            } else if (getDsmSetting(sk_indeed_jobs, "column_count") == 2) {
                grid_sizer_item = 50
            } else if (getDsmSetting(sk_indeed_jobs, "column_count") == 3) {
                grid_sizer_item = 33
            } else if (getDsmSetting(sk_indeed_jobs, "column_count") == 4) {
                grid_sizer_item = 25
            } else if (getDsmSetting(sk_indeed_jobs, "column_count") == 5) {
                grid_sizer_item = 20
            }
        }
        jQuery("body .grid-sizer-indeed-jobs, body .grid-item-indeed-jobs").css(
            { width: grid_sizer_item + "%" }
        )
        if (
            getDsmSetting(sk_indeed_jobs, "layout") == 1 ||
            getDsmSetting(sk_indeed_jobs, "layout") == 3
        ) {
            var imgs = sk_indeed_jobs.find("img")
            var len = imgs.length
            if (len == 0 || imgs.prop("complete")) {
                setTimeout(function () {
                    setFeedHeight(sk_indeed_jobs)
                }, 100)
            }
            var counter = 0
            ;[].forEach.call(imgs, function (img) {
                img.addEventListener(
                    "load",
                    function () {
                        counter++
                        if (
                            counter == len ||
                            counter == len + 1 ||
                            counter >= len
                        ) {
                            setTimeout(function () {
                                setFeedHeight(sk_indeed_jobs)
                            }, 100)
                        }
                    },
                    false
                )
            })
        }
    }
    function setFeedHeight(sk_indeed_jobs) {
        if (sk_indeed_jobs.find(".grid-item-indeed-jobs").length < 1) {
            return
        }
        if (getDsmSetting(sk_indeed_jobs, "layout") == 3) {
            skLayoutSliderHeight(sk_indeed_jobs)
        }
        if (getDsmSetting(sk_indeed_jobs, "layout") == 1) {
            var imgs = sk_indeed_jobs.find("img")
            var len = imgs.length
            if (len == 0 || imgs.prop("complete")) {
                setTimeout(function () {
                    setPostsHeight(sk_indeed_jobs)
                }, 500)
            }
            var counter = 0
            ;[].forEach.call(imgs, function (img) {
                img.addEventListener(
                    "load",
                    function () {
                        counter++
                        if (
                            counter == len ||
                            counter == len + 1 ||
                            counter >= len
                        ) {
                            setTimeout(function () {
                                setPostsHeight(sk_indeed_jobs)
                            }, 500)
                        }
                    },
                    false
                )
            })
        }
    }
    function setPostsHeight(sk_indeed_jobs) {
        var grid_jobs_height = getDsmSetting(sk_indeed_jobs, "post_height")
        sk_indeed_jobs
            .find(".grid-content")
            .find(".jobs-content")
            .css("height", grid_jobs_height + "px")
        var max = 0
        sk_indeed_jobs.find(".sk-job-title-container").each(function () {
            if (max < jQuery(this).height()) {
                max = jQuery(this).height()
            }
        })
        sk_indeed_jobs
            .find(".sk-job-title-container")
            .css("height", max + 30 + "px")
        hoverContent(sk_indeed_jobs)
        fixPostsWidth(sk_indeed_jobs)
        setTimeout(function () {
            fixPostsWidth(sk_indeed_jobs)
        }, 200)
        setTimeout(function () {
            fixPostsWidth(sk_indeed_jobs)
        }, 400)
        setTimeout(function () {
            fixPostsWidth(sk_indeed_jobs)
        }, 600)
        setTimeout(function () {
            fixPostsWidth(sk_indeed_jobs)
        }, 800)
        setTimeout(function () {
            fixPostsWidth(sk_indeed_jobs)
        }, 1000)
    }
    function resize_iFrame() {
        var img_width = jQuery(".mfp-content .sk_media_content img").width()
        var img_height = jQuery(".mfp-content .sk_media_content img").height()
        jQuery(".mfp-content .sk_media_content iframe").width(img_width)
        jQuery(".mfp-content .sk_media_content iframe").height(img_height)
    }
    function resizeHeightBasedOnContent(sk_indeed_jobs) {
        for (var i = 0; i <= 10; i++) {
            setTimeout(function () {
                makeResponsive(jQuery, sk_indeed_jobs)
            }, i * 1000)
        }
    }
    function fixPostsWidth(sk_indeed_jobs) {
        sk_indeed_jobs
            .find(".grid-content")
            .find(".sk-jobs-content-body")
            .css({
                width: sk_indeed_jobs.find(".jobs-content").width() - 6 + "px",
            })
    }
    function applyCustomUi(jQuery, sk_indeed_jobs) {
        sk_indeed_jobs.find(".loading-img").hide()
        var sk_indeed_jobs_width = sk_indeed_jobs
            .find(".sk_indeed_jobs_width")
            .text()
        sk_indeed_jobs.css({ width: "100%" })
        var sk_indeed_jobs_width = sk_indeed_jobs.innerWidth()
        sk_indeed_jobs.css({ height: "auto" })
        var column_count = sk_indeed_jobs.find(".column_count").text()
        var border_size = 0
        var background_color = "#555555"
        var space_between_images = sk_indeed_jobs
            .find(".space_between_images")
            .text()
        var margin_between_images =
            parseFloat(space_between_images).toFixed(2) / 2
        var total_space_between_images =
            parseFloat(space_between_images).toFixed(2) *
            parseFloat(column_count)
        var pic_width =
            (parseFloat(sk_indeed_jobs_width).toFixed(2) -
                parseFloat(total_space_between_images).toFixed(2)) /
            parseFloat(column_count).toFixed(2)
        var sk_ig_all_jobs_minus_spaces =
            parseFloat(sk_indeed_jobs_width).toFixed(2) -
            parseFloat(total_space_between_images).toFixed(2)
        var bottom_button_container_width =
            parseFloat(sk_indeed_jobs_width).toFixed(2) -
            parseFloat(space_between_images).toFixed(2) * 2
        var bottom_button_width =
            parseFloat(sk_indeed_jobs_width).toFixed(2) /
            parseFloat(2).toFixed(2)
        var sk_indeed_jobs_width_minus_space_between_images =
            parseFloat(sk_indeed_jobs_width).toFixed(2) -
            parseFloat(space_between_images).toFixed(2)
        jQuery(".sk-ww-indeed-jobs, .sk-popup-container").css({
            "font-family": getDsmSetting(sk_indeed_jobs, "font_family"),
            width: sk_indeed_jobs_width_minus_space_between_images,
            "background-color": getDsmSetting(
                sk_indeed_jobs,
                "widget_bg_color"
            ),
            color: getDsmSetting(sk_indeed_jobs, "widget_font_color"),
        })
        sk_indeed_jobs
            .find(".sk-separator")
            .css({ border: "1px solid #f1f1f1", transform: "scaleY(0.5)" })
        if (getDsmSetting(sk_indeed_jobs, "show_pop_up") == 1) {
            sk_indeed_jobs.find(".jobs-content").css("cursor", "pointer")
        }
        let title_background_color = getDsmSetting(
            sk_indeed_jobs,
            "title_background_color"
        )
            ? getDsmSetting(sk_indeed_jobs, "title_background_color")
            : "#ffffff"
        sk_indeed_jobs
            .find(".sk-job-title-container")
            .css({ "background-color": title_background_color })
        var arrow_background_color = getDsmSetting(
            sk_indeed_jobs,
            "arrow_background_color"
        )
        var arrow_color = getDsmSetting(sk_indeed_jobs, "arrow_color")
        var arrow_opacity = getDsmSetting(sk_indeed_jobs, "arrow_opacity")
        jQuery(".sk-pop-ig-jobs").css({
            "font-family": getDsmSetting(sk_indeed_jobs, "font_family"),
        })
        sk_indeed_jobs
            .find(
                ".sk-job-title-container, .sk_jobs_name, .sk_jobs_media, .sk_jobs_media a, .jobs-jobs-counts, .sk_link_meta, .sk-jobs-text-padding"
            )
            .css({ color: getDsmSetting(sk_indeed_jobs, "details_font_color") })
        sk_indeed_jobs
            .find(".grid-content")
            .css({
                "background-color": getDsmSetting(
                    sk_indeed_jobs,
                    "details_bg_color"
                ),
            })
        sk_indeed_jobs
            .find(".sk-secondary-data")
            .css({
                color: getDsmSetting(
                    sk_indeed_jobs,
                    "details_secondary_font_color"
                ),
                "font-family": getDsmSetting(sk_indeed_jobs, "font_family"),
            })
        sk_indeed_jobs
            .find(
                ".sk-fb-page-name, .sk-indeed-jobs-profile-info button, .sk-btn-apply-now, .sk-indeed-jobs-load-more-jobs"
            )
            .css({
                "font-family": getDsmSetting(sk_indeed_jobs, "font_family"),
            })
        sk_indeed_jobs
            .find(".sk-fb-page-name a")
            .css({
                "font-size": getDsmSetting(sk_indeed_jobs, "title_font_size"),
            })
        sk_indeed_jobs
            .find(".sk-ww-indeed-jobs-item")
            .css({
                color: getDsmSetting(sk_indeed_jobs, "details_font_color"),
                "border-top":
                    "thin solid " +
                    getDsmSetting(sk_indeed_jobs, "jobs_separator_color"),
            })
        sk_indeed_jobs
            .find(".sk-popup-container")
            .css({
                padding:
                    getDsmSetting(sk_indeed_jobs, "item_content_padding") +
                    "px",
                "border-radius": "8px",
            })
        if (sk_indeed_jobs_width <= 480) {
            sk_indeed_jobs.find(".sk-popup-container").css({ padding: "20px" })
        }
        var margin_bottom_sk_ig_load_more_jobs = space_between_images
        if (margin_bottom_sk_ig_load_more_jobs == 0) {
            margin_bottom_sk_ig_load_more_jobs = 5
        }
        sk_indeed_jobs
            .find(".sk-indeed-jobs-load-more-jobs")
            .css({ "margin-bottom": margin_bottom_sk_ig_load_more_jobs + "px" })
        sk_indeed_jobs
            .find(
                ".indeed-jobs-user-container, .sk-indeed-jobs-load-more-jobs, .sk-indeed-jobs-bottom-follow-btn"
            )
            .css({
                "background-color": getDsmSetting(
                    sk_indeed_jobs,
                    "button_bg_color"
                ),
                "border-color": getDsmSetting(
                    sk_indeed_jobs,
                    "button_bg_color"
                ),
                color: getDsmSetting(sk_indeed_jobs, "button_text_color"),
            })
        if (getDsmSetting(sk_indeed_jobs, "show_box_shadow") == 1) {
            sk_indeed_jobs
                .find(".grid-content")
                .css({
                    "box-shadow": "0 2px 5px 0 rgba(0,0,0,0.15)",
                    "-moz-box-shadow": "0 2px 5px 0 rgba(0,0,0,0.15)",
                    "-webkit-box-shadow": "0 2px 5px 0 rgba(0,0,0,0.15)",
                })
        }
        sk_indeed_jobs
            .find(".sk-indeed-jobs-shared-info")
            .css({
                "margin-top": "15px",
                "box-shadow":
                    "0 0 0 1px rgba(0, 0, 0, .15) inset, 0 1px 4px rgba(0, 0, 0, .1)",
                "-moz-box-shadow":
                    "0 0 0 1px rgba(0, 0, 0, .15) inset, 0 1px 4px rgba(0, 0, 0, .1)",
                "-webkit-box-shadow":
                    "0 0 0 1px rgba(0, 0, 0, .15) inset, 0 1px 4px rgba(0, 0, 0, .1)",
            })
        sk_indeed_jobs
            .find(".sk-indeed-jobs-shared-info .sk_jobs_media")
            .css({ padding: "5px" })
        sk_indeed_jobs
            .find(
                ".indeed-jobs-user-container, .sk-indeed-jobs-load-more-jobs, .sk-indeed-jobs-bottom-follow-btn"
            )
            .mouseover(function () {
                jQuery(this).css({
                    "background-color": getDsmSetting(
                        sk_indeed_jobs,
                        "button_hover_bg_color"
                    ),
                    "border-color": getDsmSetting(
                        sk_indeed_jobs,
                        "button_hover_bg_color"
                    ),
                    color: getDsmSetting(
                        sk_indeed_jobs,
                        "button_hover_text_color"
                    ),
                })
            })
            .mouseout(function () {
                jQuery(this).css({
                    "background-color": getDsmSetting(
                        sk_indeed_jobs,
                        "button_bg_color"
                    ),
                    "border-color": getDsmSetting(
                        sk_indeed_jobs,
                        "button_bg_color"
                    ),
                    color: getDsmSetting(sk_indeed_jobs, "button_text_color"),
                })
            })
        var padding_sk_ig_bottom_btn_container = margin_between_images
        if (padding_sk_ig_bottom_btn_container == 0) {
            padding_sk_ig_bottom_btn_container = 5
        }
        sk_indeed_jobs
            .find(".sk-indeed-jobs-bottom-btn-container")
            .css({ padding: padding_sk_ig_bottom_btn_container + "px" })
        sk_indeed_jobs
            .find(".sk-indeed-jobs-profile-description strong")
            .css({ color: getDsmSetting(sk_indeed_jobs, "widget_font_color") })
        fixedMultipleImageHeight(pic_width)
        applyDsmDetailsLinkColor(sk_indeed_jobs)
        applyDsmDetailsLinkHoverColor(sk_indeed_jobs)
        applyDsmPostContentPadding(sk_indeed_jobs)
        applyDsmTitleAllCapitalization(sk_indeed_jobs)
        applyDsmDefaultFonts(sk_indeed_jobs)
        applyDsmPictureShape(sk_indeed_jobs)
        applyDsmFontFamily(sk_indeed_jobs)
        applyGridImageLayout(sk_indeed_jobs)
        jQuery(".sk_powered_by a").css({
            "background-color": getDsmSetting(
                sk_indeed_jobs,
                "details_bg_color"
            ),
            color: getDsmSetting(sk_indeed_jobs, "details_font_color"),
            "font-size": getDsmSetting(sk_indeed_jobs, "details_font_size"),
        })
        sk_indeed_jobs
            .find(".sk-fb-event-item, .sk_powered_by")
            .css({
                "margin-bottom":
                    getDsmSetting(sk_indeed_jobs, "space_between_events") +
                    "px",
            })
        if (jQuery(".mfp-content").length == 0)
            makeResponsive(jQuery, sk_indeed_jobs)
        var custom_css =
            getDsmSetting(sk_indeed_jobs, "custom_css") +
            " body .sk_branding{ display : block !important; } body .sk_branding a{ display : block !important; }"
        jQuery("head").append(
            '<style type="text/css">' + custom_css + "</style>"
        )
        setTimeout(function () {
            if (getDsmSetting(sk_indeed_jobs, "links_clickable") == 0) {
                sk_indeed_jobs
                    .find(".href_status_trigger_feed")
                    .removeAttr("href")
                sk_indeed_jobs
                    .find(".href_status_trigger_feed_container")
                    .find("a")
                    .removeAttr("href")
                sk_indeed_jobs
                    .find(".href_status_trigger_jobs")
                    .removeAttr("href")
                sk_indeed_jobs
                    .find(".href_status_trigger_jobs_container")
                    .find("a")
                    .removeAttr("href")
                sk_indeed_jobs
                    .find(".href_status_trigger_feed")
                    .css({
                        color: getDsmSetting(
                            sk_indeed_jobs,
                            "widget_font_color"
                        ),
                    })
                sk_indeed_jobs
                    .find(".href_status_trigger_feed_container")
                    .find("a")
                    .css({
                        color: getDsmSetting(
                            sk_indeed_jobs,
                            "widget_font_color"
                        ),
                    })
            } else {
                sk_indeed_jobs
                    .find(".href_status_trigger_feed")
                    .css({
                        color: getDsmSetting(
                            sk_indeed_jobs,
                            "widget_link_color"
                        ),
                    })
                sk_indeed_jobs
                    .find(".href_status_trigger_feed_container")
                    .find("a")
                    .css({
                        color: getDsmSetting(
                            sk_indeed_jobs,
                            "widget_link_color"
                        ),
                    })
            }
        }, 500)
        if (getDsmSetting(sk_indeed_jobs, "layout") == 3) {
            sk_indeed_jobs
                .find(".indeed-jobs-user-root-container, .grid-indeed-jobs")
                .css({
                    width: "88%",
                    margin: "0 auto",
                    display: "block",
                    overflow: "hidden",
                })
            if (sk_indeed_jobs.width() < 450) {
                sk_indeed_jobs
                    .find(".indeed-jobs-user-root-container, .grid-indeed-jobs")
                    .css({ width: "80%", margin: "0 auto" })
            }
            sk_indeed_jobs
                .find(".indeed-jobs-user-root-container")
                .css({ padding: "8px" })
            sk_indeed_jobs
                .find(".sk-indeed-jobs-profile-info")
                .css({ width: "auto" })
            sk_indeed_jobs
                .find(".swiper-button-next,.swiper-button-prev")
                .css({
                    border: "0px",
                    background: "transparent",
                    "background-image": "none",
                    outline: "none",
                    "font-size": "0px",
                })
        }
        if (jQuery(document).width() <= 380) {
            sk_indeed_jobs
                .find(".sk-indeed-jobs-shared-info")
                .find(".jobs-image")
                .css({ "margin-right": "5px" })
            sk_indeed_jobs
                .find(".sk-indeed-jobs-shared-info")
                .find(".jobs-image")
                .find("img")
                .css({ width: "45px" })
            sk_indeed_jobs
                .find(".sk-indeed-jobs-shared-info")
                .find(".sk-fb-page-name")
                .css({ "font-size": "12px" })
        }
        var profile_image_container = sk_indeed_jobs
            .find(".sk-indeed-jobs-shared-info")
            .find(".jobs-image")
        var profile_image_container_size =
            profile_image_container.length > 0
                ? profile_image_container.css("marginRight").replace("px", "")
                : 10
        var new_owner_description_size =
            profile_image_container.width() +
            parseInt(profile_image_container_size)
        sk_indeed_jobs
            .find(".sk-indeed-shared-jobs-owner-description")
            .css({ "margin-left": new_owner_description_size + "px" })
        if (!getDsmSetting(sk_indeed_jobs, "show_hiring_rate")) {
            sk_indeed_jobs.find(".sk-jobs-ago-text").css("margin-left", "0")
        }
        applyLinksClickableStyle(sk_indeed_jobs)
        if (
            sk_indeed_jobs.find(".sk-bio-username").text().toLowerCase() ==
            "Commonwealth-Land-Trust,-Inc.".toLowerCase()
        ) {
            sk_indeed_jobs
                .find(".indeed-jobs-profile-pic")
                .css({ "background-size": "80px 35px" })
        }
    }
    function applyLinksClickableStyle(sk_indeed_jobs) {
        var links_clickable = getDsmSetting(sk_indeed_jobs, "links_clickable")
        var details_font_color = getDsmSetting(
            sk_indeed_jobs,
            "details_font_color"
        )
        if (links_clickable == 1) {
            sk_indeed_jobs
                .find(".href_status_trigger_jobs, .sk-job-title-container")
                .css("cursor", "pointer")
        } else {
            sk_indeed_jobs
                .find(".href_status_trigger_jobs, .sk-job-title-container")
                .css("color", details_font_color)
        }
    }
    function applyDsmDetailsLinkColor(sk_indeed_jobs) {
        sk_indeed_jobs
            .find(".grid-content a")
            .css({ color: getDsmSetting(sk_indeed_jobs, "details_link_color") })
    }
    function applyDsmDetailsLinkHoverColor(sk_indeed_jobs) {
        if (getDsmSetting(sk_indeed_jobs, "links_clickable") == 1) {
            sk_indeed_jobs.find(".grid-content a").hover(
                function () {
                    jQuery(this).css({
                        color: getDsmSetting(
                            sk_indeed_jobs,
                            "details_link_hover_color"
                        ),
                    })
                },
                function () {
                    jQuery(this).css({
                        color: getDsmSetting(
                            sk_indeed_jobs,
                            "details_link_color"
                        ),
                    })
                }
            )
        }
    }
    function applyDsmPostContentPadding(sk_indeed_jobs) {
        var padding =
            getDsmSetting(sk_indeed_jobs, "item_content_padding") + "px"
        sk_indeed_jobs
            .find(".sk-jobs-details-container")
            .css({ padding: "0 " + padding + padding + padding })
        sk_indeed_jobs
            .find(".sk-jobs-details-container")
            .css({ padding: padding })
    }
    function applyDsmTitleAllCapitalization(sk_indeed_jobs) {
        var element = sk_indeed_jobs.find(".sk-indeed-jobs-profile-usename")
        if (getDsmSetting(sk_indeed_jobs, "title_all_caps") == 1) {
            element.css({
                "text-transform": "uppercase",
                "font-size":
                    getDsmSetting(sk_indeed_jobs, "title_font_size") + "px",
            })
        } else {
            element.css({
                "font-size":
                    getDsmSetting(sk_indeed_jobs, "title_font_size") + "px",
            })
        }
    }
    function applyDsmDefaultFonts(sk_indeed_jobs) {
        var element = sk_indeed_jobs.find(
            ".grid-content,.sk-indeed-jobs-profile-counts,.sk-indeed-jobs-profile-description,.sk-indeed-jobs-profile-info button,.sk-indeed-jobs-load-more-jobs,.sk-indeed-jobs-bottom-follow-btn,.sk-btn-apply-now"
        )
        if (getDsmSetting(sk_indeed_jobs, "details_all_caps") == 1) {
            element.css({
                "text-transform": "uppercase",
                "font-size":
                    getDsmSetting(sk_indeed_jobs, "details_font_size") + "px",
            })
        } else {
            element.css({
                "font-size":
                    getDsmSetting(sk_indeed_jobs, "details_font_size") + "px",
            })
        }
    }
    function applyDsmPictureShape(sk_indeed_jobs) {
        if (getDsmSetting(sk_indeed_jobs, "show_circular_main_picture") == 1) {
            sk_indeed_jobs
                .find(".indeed-jobs-profile-pic,.img-thumbnail")
                .css({
                    "webkit-border-radius": "50%",
                    "-moz-border-radius": "50%",
                    "border-radius": "50%",
                })
            sk_indeed_jobs
                .find(".jobs-image .img-thumbnail")
                .css({ height: "50px", width: "50px" })
            sk_indeed_jobs
                .find(".sk-indeed-jobs-shared-info .img-thumbnail")
                .css({ width: "40px", height: "40px" })
        } else {
            sk_indeed_jobs
                .find(".indeed-jobs-profile-pic,.img-thumbnail")
                .css({
                    "webkit-border-radius": "0",
                    "-moz-border-radius": "0",
                    "border-radius": "0",
                })
            sk_indeed_jobs
                .find(".sk-indeed-jobs-shared-info .img-thumbnail")
                .css({ width: "40px", height: "40px" })
        }
    }
    function applyDsmFontFamily(sk_indeed_jobs) {
        var font = getDsmSetting(sk_indeed_jobs, "font_family")
        var splited_string_font = font.split(":")
        sk_indeed_jobs.css({ "font-family": splited_string_font[0] })
    }
    function applyGridImageLayout(sk_indeed_jobs) {
        var max_photo = sk_indeed_jobs.find(".max_photo")
        if (max_photo.length > 0) {
            jQuery.each(max_photo, function (i, v) {
                jQuery(v)
                    .find("div:eq(0)")
                    .css({
                        "grid-column": "1 ",
                        height: "100%",
                        "grid-row": "1/ 1 1",
                    })
                jQuery(v)
                    .find("div:eq(0) img")
                    .css({ height: "auto !important" })
            })
            jQuery(".img-count")
                .closest("div.image-item")
                .css({ position: "relative", display: "inline-block" })
        }
    }
    function fixedMultipleImageHeight(pic_width) {
        if (pic_width > 550) {
            jQuery(".image-item img").css("height", "300px")
            jQuery(".image-item img").css("max-height", "300px")
        } else {
            jQuery(".image-item img").css("height", "126px")
        }
    }
    function loadGoogleFont(font_family) {
        var web_safe_fonts = [
            "Inherit",
            "Impact, Charcoal, sans-serif",
            "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
            "Century Gothic, sans-serif",
            "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
            "Verdana, Geneva, sans-serif",
            "Copperplate, 'Copperplate Gothic Light', fantasy",
            "'Courier New', Courier, monospace",
            "Georgia, Serif",
        ]
        if (!web_safe_fonts.includes(font_family)) {
            try {
                loadCssFile(
                    "https://fonts.googleapis.com/css?family=" + font_family
                )
            } catch (error) {}
        }
    }
    function addDescriptiveTagAttributes(_sk, add_to_img = true) {
        _sk.find("a").each(function (i, v) {
            var title = jQuery(v).text()
            jQuery(v).attr("title", title)
        })
        if (add_to_img) {
            _sk.find("img").each(function (i, v) {
                var src = jQuery(v).attr("src")
                jQuery(v).attr("alt", "Post image")
            })
        }
    }
    function getClientId() {
        var _gaCookie = document.cookie.match(/(^|[;,]\s?)_ga=([^;,]*)/)
        if (_gaCookie) return _gaCookie[2].match(/\d+\.\d+$/)[0]
    }
    function getSkEmbedId(sk_class) {
        var embed_id = sk_class.attr("embed-id")
        if (embed_id == undefined) {
            embed_id = sk_class.attr("data-embed-id")
        }
        return embed_id
    }
    function getSkSetting(sk_class, key) {
        return sk_class.find("div." + key).text()
    }
    function setCookieSameSite() {
        document.cookie =
            "AC-C=ac-c;expires=Fri, 31 Dec 2025 23:59:59 GMT;path=/;HttpOnly;SameSite=Lax"
    }
    setCookieSameSite()
    function getIEVersion() {
        var sAgent = window.navigator.userAgent
        var Idx = sAgent.indexOf("MSIE")
        if (Idx > 0)
            return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)))
        else if (!!navigator.userAgent.match(/Trident\/7\./)) return 11
        else return 0
    }
    function isSafariBrowser() {
        var ua = navigator.userAgent.toLowerCase()
        if (ua.indexOf("safari") != -1) {
            if (ua.indexOf("chrome") > -1) {
                return 0
            } else {
                return 1
            }
        }
    }
    if (getIEVersion() > 0 || isSafariBrowser() > 0) {
        loadIEScript("https://cdn.jsdelivr.net/bluebird/3.5.0/bluebird.min.js")
        loadIEScript(
            "https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js"
        )
    }
    function loadIEScript(url) {
        var scriptTag = document.createElement("script")
        scriptTag.setAttribute("type", "text/javascript")
        scriptTag.setAttribute("src", url)
        ;(
            document.getElementsByTagName("head")[0] || document.documentElement
        ).appendChild(scriptTag)
    }
    function kFormatter(num) {
        return Math.abs(num) > 999
            ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
            : Math.sign(num) * Math.abs(num)
    }
    function sk_increaseView(user_info) {
        try {
            if (!user_info) return
            jQuery.getJSON(
                "https://api.ipify.org?format=json",
                function (data) {
                    var update_views_url =
                        "https://views.accentapi.com/add_view.php?user_id=" +
                        user_info.id +
                        "&url=" +
                        document.URL +
                        "&ip_address=" +
                        data.ip +
                        "&embed_id=" +
                        user_info.embed_id
                    if (app_url.includes("local") && sk_app_url) {
                        update_views_url =
                            "https://localtesting.com/accentapiviews/add_view.php?user_id=" +
                            user_info.id +
                            "&url=" +
                            document.URL +
                            "&ip_address=" +
                            data.ip +
                            "&embed_id=" +
                            user_info.embed_id
                    }
                    jQuery.ajax(update_views_url)
                }
            )
        } catch (err) {
            console.log("Error retrieving ip address.")
        }
    }
    function isTooDarkColor(hexcolor) {
        var r = parseInt(hexcolor.substr(1, 2), 16)
        var g = parseInt(hexcolor.substr(3, 2), 16)
        var b = parseInt(hexcolor.substr(4, 2), 16)
        if (hexcolor.indexOf("rgb") != -1) {
            let rgbstr = hexcolor
            let v = getRGB(rgbstr)
            r = v[0]
            g = v[1]
            b = v[2]
        }
        b = isNaN(b) ? 0 : b
        var yiq = (r * 299 + g * 587 + b * 114) / 1000
        if (yiq < 60) {
        } else {
        }
        return yiq < 60 ? true : false
    }
    function linkify(html) {
        var temp_text = html.split("https://www.").join("https://")
        temp_text = temp_text.split("www.").join("https://www.")
        var exp =
            /((href|src)=["']|)(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
        return temp_text.replace(exp, function () {
            return arguments[1]
                ? arguments[0]
                : '<a href="' + arguments[3] + '">' + arguments[3] + "</a>"
        })
    }
    function skGetEnvironmentUrls(folder_name) {
        var scripts = document.getElementsByTagName("script")
        var scripts_length = scripts.length
        var search_result = -1
        var other_result = -1
        var app_url = "https://widgets.sociablekit.com/"
        var app_backend_url = "https://api.accentapi.com/v1/"
        var app_file_server_url = "https://data.accentapi.com/feed/"
        var sk_app_url = "https://sociablekit.com/app/"
        var sk_api_url = "https://api.sociablekit.com/"
        var sk_img_url = "https://images.sociablekit.com/"
        for (var i = 0; i < scripts_length; i++) {
            var src_str = scripts[i].getAttribute("src")
            if (src_str != null) {
                var other_folder = ""
                if (folder_name == "facebook-page-playlist") {
                    other_folder = "facebook-page-playlists"
                } else if (folder_name == "linkedin-page-posts") {
                    other_folder = "linkedin-page-post"
                } else if (folder_name == "linkedin-profile-posts") {
                    other_folder = "linkedin-profile-post"
                } else if (folder_name == "facebook-hashtag-posts") {
                    other_folder = "facebook-hashtag-feed"
                } else if (folder_name == "facebook-page-events") {
                    other_folder = "facebook-events"
                } else if (folder_name == "facebook-page-posts") {
                    other_folder = "facebook-feed"
                    if (document.querySelector(".sk-ww-facebook-feed")) {
                        var element = document.getElementsByClassName(
                            "sk-ww-facebook-feed"
                        )[0]
                        element.classList.add("sk-ww-facebook-page-posts")
                    }
                }
                other_result = src_str.search(other_folder)
                search_result = src_str.search(folder_name)
                if (search_result >= 1 || other_result >= 1) {
                    var src_arr = src_str.split(folder_name)
                    app_url = src_arr[0]
                    app_url = app_url.replace(
                        "displaysocialmedia.com",
                        "sociablekit.com"
                    )
                    if (app_url.search("local") >= 1) {
                        app_backend_url = "http://localhost:3000/v1/"
                        app_url =
                            "https://localtesting.com/SociableKIT_Widgets/"
                        app_file_server_url =
                            "https://localtesting.com/SociableKIT_FileServer/feed/"
                        sk_app_url = "https://localtesting.com/SociableKIT/"
                        sk_api_url = "http://127.0.0.1:8000/"
                        sk_img_url =
                            "https://localtesting.com/SociableKIT_Images/"
                    } else {
                        app_url = "https://widgets.sociablekit.com/"
                    }
                }
            }
        }
        return {
            app_url: app_url,
            app_backend_url: app_backend_url,
            app_file_server_url: app_file_server_url,
            sk_api_url: sk_api_url,
            sk_app_url: sk_app_url,
            sk_img_url: sk_img_url,
        }
    }
    function changeBackSlashToBR(text) {
        if (text) {
            for (var i = 1; i <= 10; i++) {
                text = text.replace("\n", "</br>")
            }
        }
        return text
    }
    function sKGetScrollbarWidth() {
        var outer = document.createElement("div")
        outer.style.visibility = "hidden"
        outer.style.overflow = "scroll"
        outer.style.msOverflowStyle = "scrollbar"
        document.body.appendChild(outer)
        var inner = document.createElement("div")
        outer.appendChild(inner)
        var scrollbarWidth = outer.offsetWidth - inner.offsetWidth
        outer.parentNode.removeChild(outer)
        return scrollbarWidth
    }
    function isValidURL(url) {
        const urlPattern =
            /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
        return urlPattern.test(url)
    }
    async function showUrlData(
        element,
        url,
        post_id,
        type = "",
        show_thumbnail = 1
    ) {
        element.hide()
        var free_data_url =
            app_file_server_url.replace("feed/", "get_fresh_url_tags.php") +
            "?post_id=" +
            post_id +
            "&url=" +
            url
        var read_one_url =
            app_file_server_url.replace("feed", "url-tags") + post_id + ".json"
        if (jQuery(".sk_version").text()) {
            read_one_url += "?v=" + jQuery(".sk_version").text()
        }
        fetch(read_one_url, { method: "get", cache: "no-cache" })
            .then(async (response) => {
                if (response.ok) {
                    let data = await response.json()
                    if (data && data.status && data.status == 418) {
                        displayUrlData(
                            data,
                            element,
                            type,
                            show_thumbnail,
                            post_id
                        )
                        data = await jQuery.ajax(free_data_url)
                    }
                    return data
                } else {
                    response = await jQuery.ajax(free_data_url)
                    displayUrlData(
                        response,
                        element,
                        type,
                        show_thumbnail,
                        post_id
                    )
                    return response
                }
            })
            .then(async (response) => {
                if (response != undefined) {
                    displayUrlData(
                        response,
                        element,
                        type,
                        show_thumbnail,
                        post_id
                    )
                } else {
                    response = await jQuery.ajax(free_data_url)
                    displayUrlData(
                        response,
                        element,
                        type,
                        show_thumbnail,
                        post_id
                    )
                }
            })
            .catch(async (error) => {
                var data = await jQuery.ajax(free_data_url)
                displayUrlData(data, element, type, show_thumbnail, post_id)
            })
    }
    async function displayUrlData(
        response,
        element,
        type,
        show_thumbnail = 1,
        post_id
    ) {
        var meta_holder = jQuery(element)
        var html = ""
        if (!response || response.error) {
            if (meta_holder.html()) {
                meta_holder.show()
            }
            return
        }
        if (
            response.message &&
            response.message == "Data not available. Please try again."
        ) {
            return
        }
        if (
            response.messages &&
            response.messages.length > 0 &&
            response.messages[0] ==
                "PDF files that are over 10Mb are not supported by Google Docs Viewer"
        ) {
            var data = response.url
            if (response.url) {
                data = response.url.replace("https://", "").split("/")
            }
            if (data.length > 0) {
                if (data.length > 1) {
                    response.title = data[data.length - 1]
                }
                response.description = data[0].replace("www.", "")
            }
        }
        if (post_id == "7059257055500492800") {
            response.url += "?id=122630"
        }
        html += "<a href='" + response.url + "' link-only target='_blank'>"
        html +=
            "<div class='sk-link-article-container' style='background: #eeeeee;color: black !important; font-weight: bold !important; border-radius: 2px; border: 1px solid #c3c3c3; box-sizing: border-box; word-wrap: break-word;'>"
        if (show_thumbnail == 1) {
            html +=
                "<image alt='No alternative text description for this image' class='sk-link-article-image sk_post_img_link' onerror='this.style.display=\"none\"' src='" +
                response.thumbnail_url +
                "'/>"
        }
        if (response.title) {
            html +=
                "<div class='sk-link-article-title' style='padding: 8px;'>" +
                response.title +
                "</div>"
        } else if (response.url && response.url.indexOf(".pdf") != -1) {
            html += response.html
        }
        if (type && type == 6) {
            if (response.description && response.description.length > 0) {
                response.description =
                    response.description.length > 140
                        ? response.description.substring(0, 140) + " ..."
                        : response.description
            }
        }
        if (
            response.description &&
            response.description.indexOf("[vc_row]") !== -1 &&
            response.url
        ) {
            var pathArray = response.url.split("/")
            var protocol = pathArray[0]
            if (pathArray.length > 2) {
                var host = pathArray[2]
                var url = protocol + "//" + host
                html +=
                    "<div class='sk-link-article-description' style='padding: 8px;color: grey;font-weight: 100;font-size: 14px;'>" +
                    url +
                    "</div>"
            }
        } else if (
            response.description &&
            response.description.indexOf("fb_built") == -1 &&
            response.description != "null"
        ) {
            if (response.url) {
                var domain = new URL(response.url).hostname
                response.description = domain
            }
            html +=
                "<div class='sk-link-article-description' style='padding: 8px;color: #000000;font-weight: 100;font-size: 14px;'>" +
                response.description +
                "</div>"
        } else if (response.url && response.url.includes("instagram.com/p/")) {
            html +=
                "<image style='padding: 8px;' alt='No alternative text description for this image' class='sk-ig-default' onerror='this.style.display=\"none\"' src='https://i1.wp.com/sociablekit.com/wp-content/uploads/2019/01/instagram.png'/>"
            html +=
                "<div class='sk-link-article-description' style='padding: 8px;margin-left:15%;color: #000000;font-weight: 600;font-size: 14px;'>View this post in instagram</div>"
            html +=
                "<div class='sk-link-article-description' style='padding: 0px 8px ;margin-left:15%;margin-bottom:10px;color: #000000;font-weight: 100;font-size: 10px;'>" +
                response.url +
                "</div>"
        }
        html += "</div>"
        html += "</a>"
        meta_holder.html(html)
        meta_holder.css("display", "block")
        meta_holder.css("margin-bottom", "15px")
        meta_holder
            .find(".sk-ig-default")
            .closest(".sk-link-article-container")
            .css("display", "inline-block")
        meta_holder
            .find(".sk-ig-default")
            .closest(".sk-link-article-container")
            .css("width", "100%")
        meta_holder.find(".sk-ig-default").css("width", "20%")
        meta_holder.find(".sk-ig-default").css("float", "left")
        applyMasonry()
    }
    function slugifyString(str) {
        str = str.replace(/^\s+|\s+$/g, "")
        str = str.toLowerCase()
        var from =
            "ÃÃ„Ã‚Ã€ÃƒÃ…ÄŒÃ‡Ä†ÄŽÃ‰ÄšÃ‹ÃˆÃŠáº¼Ä”È†ÃÃŒÃŽÃÅ‡Ã‘Ã“Ã–Ã’Ã”Ã•Ã˜Å˜Å”Å Å¤ÃšÅ®ÃœÃ™Ã›ÃÅ¸Å½Ã¡Ã¤Ã¢Ã Ã£Ã¥ÄÃ§Ä‡ÄÃ©Ä›Ã«Ã¨Ãªáº½Ä•È‡Ã­Ã¬Ã®Ã¯ÅˆÃ±Ã³Ã¶Ã²Ã´ÃµÃ¸Ã°Å™Å•Å¡Å¥ÃºÅ¯Ã¼Ã¹Ã»Ã½Ã¿Å¾Ã¾ÃžÄÄ‘ÃŸÃ†aÂ·/_,:;"
        var to =
            "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------"
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
        }
        str = str
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
        return str
    }
    function skGetBranding(sk_, user_info) {
        sk_.find(".sk_branding").remove()
        sk_.find("div.user_email").remove()
        var html = ""
        if (!user_info) return
        var slugify_string = ""
        if (user_info.solution_name) {
            slugify_string = slugifyString(user_info.solution_name)
            user_info.tutorial_link =
                "https://www.sociablekit.com/tutorials/embed-" +
                slugify_string +
                "-website/"
            if (user_info.website_builder) {
                user_info.tutorial_link =
                    "https://www.sociablekit.com/tutorials/embed-" +
                    slugify_string
                slugify_string = slugifyString(user_info.website_builder)
                user_info.tutorial_link =
                    user_info.tutorial_link + "-" + slugify_string
            }
        }
        if (user_info.type == 9) {
            user_info.tutorial_link =
                "https://www.sociablekit.com/sync-facebook-page-events-to-google-calendar/"
        } else if (user_info.type == 26) {
            user_info.tutorial_link =
                "https://www.sociablekit.com/how-to-sync-facebook-group-events-to-google-calendar-on-website/"
        }
        if (
            (user_info.show_branding &&
                (user_info.show_branding == 1 ||
                    user_info.show_branding == "true")) ||
            user_info.show_branding == true
        ) {
            var fontFamily = getSkSetting(sk_, "font_family")
            var link_color = getSkSetting(sk_, "details_link_color")
            var details_bg_color = getSkSetting(sk_, "details_bg_color")
            if (link_color == "") {
                link_color = "rgb(52, 128, 220)"
            }
            if (
                details_bg_color &&
                isTooDarkColor(link_color) == false &&
                isTooDarkColor(details_bg_color) == false
            ) {
                link_color = "#3480dc"
            }
            var temporary_tutorial_link = user_info.tutorial_link
            if (temporary_tutorial_link.endsWith("/") == false) {
                temporary_tutorial_link = temporary_tutorial_link + "/"
            }
            var linkedin_widgets = [33, 34, 44, 58, 75, 99, 100, 103]
            if (
                linkedin_widgets.includes(user_info.type) &&
                user_info.embed_id % 2 == 1
            ) {
                var website_builder = "website"
                if (user_info.website_builder) {
                    website_builder = slugifyString(user_info.website_builder)
                }
                temporary_tutorial_link =
                    "https://www.sociablekit.com/tutorials/embed-linkedin-feed-" +
                    website_builder +
                    "/"
            }
            if (user_info.type == 5 && user_info.embed_id % 2 == 1) {
                temporary_tutorial_link = temporary_tutorial_link.replace(
                    "profile",
                    "feed"
                )
            }
            var facebook_feed = [
                1, 4, 9, 10, 11, 36, 38, 43, 12, 24, 26, 49, 2, 8, 3, 18, 19,
                28, 30, 61,
            ]
            if (
                facebook_feed.includes(user_info.type) &&
                user_info.embed_id % 2 == 1
            ) {
                var website_builder = "website"
                if (user_info.website_builder) {
                    website_builder = slugifyString(user_info.website_builder)
                }
                temporary_tutorial_link =
                    "https://www.sociablekit.com/tutorials/embed-facebook-feed-" +
                    website_builder +
                    "/"
            }
            var threads_feed = [110]
            if (
                threads_feed.includes(user_info.type) &&
                user_info.embed_id % 2 == 0
            ) {
                var website_builder = "website"
                if (user_info.website_builder) {
                    website_builder = slugifyString(user_info.website_builder)
                }
                temporary_tutorial_link =
                    "https://www.sociablekit.com/tutorials/embed-threads-" +
                    website_builder +
                    "/"
            }
            var nofollow_attribute = ""
            if (window.location.href.includes("clean-concept-plus")) {
                nofollow_attribute = "rel='nofollow'"
            }
            html +=
                "<div class='sk_branding' style='padding:10px; display:block !important; text-align:center; text-decoration: none !important; color:#555; font-family:" +
                fontFamily +
                "; font-size:15px;'>"
            html +=
                "<a " +
                nofollow_attribute +
                " class='tutorial_link' href='" +
                temporary_tutorial_link +
                "' target='_blank' style='text-underline-position:under; color:" +
                link_color +
                ";font-size:15px;'>"
            if (
                linkedin_widgets.includes(user_info.type) &&
                user_info.embed_id % 2 == 1
            ) {
                html += "Embed LinkedIn Feed on your "
                if (
                    user_info.website_builder &&
                    user_info.website_builder != "Website"
                ) {
                    html += user_info.website_builder
                }
            } else if (
                facebook_feed.includes(user_info.type) &&
                user_info.embed_id % 2 == 1
            ) {
                html += "Embed Facebook Feed on your "
                if (
                    user_info.website_builder &&
                    user_info.website_builder != "Website"
                ) {
                    html += user_info.website_builder
                }
            } else {
                html += "Embed " + user_info.solution_name + " on your "
                if (
                    user_info.website_builder &&
                    user_info.website_builder != "Website"
                ) {
                    html += user_info.website_builder
                }
            }
            html += " website"
            html += "</a>"
            html += "</div>"
        }
        return html
    }
    function getRGB(rgbstr) {
        return rgbstr
            .substring(4, rgbstr.length - 1)
            .replace(/ /g, "")
            .replace("(", "")
            .split(",")
    }
    function freeTrialEndedMessage(solution_info) {
        var sk_error_message = "<div class='sk_trial_ended_message'>"
        sk_error_message +=
            "Customized feed is powered by <strong><a href='https://www.sociablekit.com/' target='_blank'>SociableKIT</a></strong>.<br>"
        sk_error_message +=
            "If you're the owner of this website, your 7-day Free Trial has ended.<br>"
        sk_error_message +=
            "If you want to continue using our services, please <strong><a target='_blank' href='https://www.sociablekit.com/app/users/subscription/subscription'>subscribe now</a></strong>."
        sk_error_message += "</div>"
        return sk_error_message
    }
    function isFreeTrialEnded(start_date) {
        var start_date = new Date(start_date)
        var current_date = new Date()
        var difference = current_date.getTime() - start_date.getTime()
        difference = parseInt(difference / (1000 * 60 * 60 * 24))
        return difference > 7 ? true : false
    }
    function unableToLoadSKErrorMessage(
        solution_info,
        additional_error_messages
    ) {
        var sk_error_message = "<ul class='sk_error_message'>"
        sk_error_message +=
            "<li><a href='" +
            solution_info.embed_id +
            "' target='_blank'>Customized " +
            solution_info.solution_name +
            " feed by SociableKIT</a></li>"
        console.log(solution_info)
        sk_error_message +=
            "<li>Unable to load " + solution_info.solution_name + ".</li>"
        for (var i = 0; i < additional_error_messages.length; i++) {
            sk_error_message += additional_error_messages[i]
        }
        sk_error_message +=
            "<li>If you think there is a problem, <a target='_blank' href='https://go.crisp.chat/chat/embed/?website_id=2e3a484e-b418-4643-8dd2-2355d8eddc6b'>chat with support here</a>. We will solve it for you.</li>"
        sk_error_message += "</ul>"
        return sk_error_message
    }
    function widgetValidation(_sk, data) {
        if (data.user_info) {
            var user_info = data.user_info
            user_info.trial_ended = false
            if (user_info.status == 7 && user_info.cancellation_date) {
                var cancellation_date = new Date(
                    user_info.cancellation_date
                ).setHours(0, 0, 0, 0)
                var current_date = new Date().setHours(0, 0, 0, 0)
                user_info.show_feed =
                    current_date > cancellation_date ? false : true
                var activation_date = new Date(
                    user_info.activation_date
                ).setHours(0, 0, 0, 0)
                if (activation_date > cancellation_date) {
                    user_info.show_feed = true
                }
            } else if (
                user_info.status == 0 ||
                user_info.status == 2 ||
                user_info.status == 10
            ) {
                user_info.show_feed = false
            }
            if (user_info.type == 43 || user_info.type == 38) {
                var sk_error_message = generateBlueMessage(_sk, user_info)
                _sk.find(".first_loading_animation").hide()
                _sk.html(sk_error_message)
            }
            if (!user_info.show_feed) {
                var sk_error_message = generateBlueMessage(_sk, user_info)
                _sk.find(".first_loading_animation").hide()
                _sk.html(sk_error_message)
            }
            return user_info.show_feed
        }
    }
    function generateBlueMessage(_sk, user_info) {
        var tutorial_link = ""
        var sk_error_message = ""
        if (user_info.solution_name) {
            var slugify_string = slugifyString(user_info.solution_name)
            tutorial_link =
                "https://www.sociablekit.com/tutorials/embed-" +
                slugify_string +
                "-website/"
        }
        if (user_info.type == 9) {
            tutorial_link =
                "https://www.sociablekit.com/sync-facebook-page-events-to-google-calendar/"
        } else if (user_info.type == 26) {
            tutorial_link =
                "https://www.sociablekit.com/how-to-sync-facebook-group-events-to-google-calendar-on-website/"
        } else if (user_info.type == 43 || user_info.type == 38) {
            var sk_error_message = "<div class='sk_error_message'>"
            sk_error_message +=
                "<p style='text-align: center !important; margin: 1rem'>" +
                user_info.solution_name +
                " are currently unavailable, please choose another <a href='https://www.sociablekit.com/demos/' target='_blank'>widget here</a></p>"
            sk_error_message += "</div>"
            return sk_error_message
        }
        if (user_info.show_feed == false) {
            if (!user_info.message || user_info.message == "") {
                var sk_error_message = "<ul class='sk_error_message'>"
                sk_error_message +=
                    "<li><a href='" +
                    tutorial_link +
                    "' target='_blank'>" +
                    user_info.solution_name +
                    " powered by SociableKIT</a></li>"
                sk_error_message +=
                    "<li>If youâ€™re the owner of this website or SociableKIT account used, we found some errors with your account.</li>"
                sk_error_message +=
                    "<li>Please login your SociableKIT account to fix it.</li>"
                sk_error_message += "</ul>"
                user_info.message = sk_error_message
            }
            sk_error_message = user_info.message
        } else if (
            user_info.solution_name == null &&
            user_info.type == null &&
            user_info.start_date == null
        ) {
            sk_error_message = "<p class='sk_error_message'>"
            sk_error_message +=
                "The SociableKIT solution does not exist. If you think this is a mistake, please contact support."
            sk_error_message += "</p>"
        } else {
            sk_error_message = "<div class='sk_error_message'>"
            sk_error_message += "<div style='display: inline-flex;width:100%;'>"
            sk_error_message += "<div>"
            sk_error_message += "<ul>"
            sk_error_message +=
                "<li><a href='" +
                tutorial_link +
                "' target='_blank'>Customized " +
                user_info.solution_name +
                " feed by SociableKIT</a></li>"
            if (user_info.type == 5) {
                sk_error_message +=
                    "<li>Make sure your instagram account <a target='_blank' href='https://www.instagram.com/" +
                    getDsmSetting(_sk, "username") +
                    "' target='_blank'><b>@" +
                    getDsmSetting(_sk, "username") +
                    "</b></a> is connected.</li>"
            } else if (user_info.type == 22 || user_info.type == 39) {
                sk_error_message +=
                    "<li>Please make sure that the <a href='https://www.sociablekit.com/how-to-identify-google-place-id/' target='blank'><b> Google Place ID </b></a> you enter is correct.</li>"
            } else {
                sk_error_message +=
                    "<li>Please make sure that the <b> Source ID/Username </b> you enter is correct.</li>"
            }
            sk_error_message +=
                "<li>Our system is syncing with your " +
                user_info.solution_name +
                " feed, please check back later.</li>"
            sk_error_message +=
                "<li>It usually takes only a few minutes, but might take up to 24 hours. We appreciate your patience.</li>"
            sk_error_message +=
                "<li>We will notify you via email once your " +
                user_info.solution_name +
                " feed is ready.</li>"
            sk_error_message +=
                "<li>Please make sure that the source ID/Username you input is correct.</li>"
            sk_error_message +=
                "<li>If you think there is a problem, <a target='_blank' href='https://go.crisp.chat/chat/embed/?website_id=2e3a484e-b418-4643-8dd2-2355d8eddc6b'>chat with support here</a>. We will solve it for you.</li>"
            sk_error_message += "</ul>"
            sk_error_message += "</div>"
            sk_error_message += "</div>"
            sk_error_message += "</div>"
        }
        return sk_error_message
    }
    function generateSolutionMessage(_sk, embed_id) {
        var json_url = sk_api_url + "api/user_embed/info/" + embed_id
        var sk_error_message = ""
        jQuery
            .getJSON(json_url, function (data) {
                if (data.type == 1 && data.encoded == true) {
                    loadEvents(_sk)
                } else if (data.type == 44 && data.encoded == true) {
                    loadFeed(_sk)
                } else if (data.type == 58 && data.encoded == true) {
                    var no_data_text = _sk.find(".no_data_text").text()
                    _sk.html(
                        "<div style='padding: 20px;text-align: center;'>" +
                            no_data_text +
                            "</div>"
                    )
                } else if (data.type == 67 && data.encoded == true) {
                    loadEvents(_sk)
                } else if (data.type == 74 && data.encoded == true) {
                    _sk.html("<div>No jobs yet, please try again later.</div>")
                } else {
                    var sk_error_message = generateBlueMessage(_sk, data)
                    _sk.find(".first_loading_animation").hide()
                    _sk.html(sk_error_message)
                }
            })
            .fail(function (e) {
                console.log(e)
            })
    }
    function copyInput(copy_button, copy_input) {
        var copy_button_orig_html = copy_button.html()
        copy_input.select()
        try {
            var successful = document.execCommand("copy")
            var msg = successful ? "successful" : "unsuccessful"
            if (msg == "successful") {
                copy_button.html("<i class='fa fa-clipboard'></i> Copied!")
                setTimeout(function () {
                    copy_button.html(copy_button_orig_html)
                }, 3000)
            } else {
                alert("Copying text command was " + msg + ".")
            }
        } catch (err) {
            alert("Oops, unable to copy.")
        }
    }
    function getDefaultLinkedInPageProfilePicture(profile_picture) {
        if (
            profile_picture &&
            profile_picture.indexOf("data:image/gif") != -1
        ) {
            profile_picture = "https://gmalcilk.sirv.com/iamge.JPG"
        }
        return profile_picture
    }
    function detectedSKDashboard() {
        let parent_url =
            window.location != window.parent.location
                ? document.referrer
                : document.location.href
        if (
            parent_url &&
            (parent_url.indexOf("sociablekit.com") != -1 ||
                parent_url.indexOf("local") != -1)
        ) {
            return true
        }
        return false
    }
    function getSKDashboardPremiumTrialMessage() {
        var sk_error_message = ""
        sk_error_message += "<ul class='sk_error_message'>"
        sk_error_message += "<li>Your 7-days premium trial has ended.</li>"
        sk_error_message +=
            "<li>Please purchase a <a href='https://www.sociablekit.com/app/users/subscription/subscription?action=subscribe_now'>SociableKIT subscription plan</a> "
        sk_error_message +=
            "to save your widget customizations, save time with automatic sync, enjoy priority support, and get a 50% discount on any annual plans. Donâ€™t miss out!</li>"
        sk_error_message +=
            "<li>You may also choose to <a href='https://help.sociablekit.com/en-us/article/how-to-activate-the-free-plan-1l3o0nt/'>activate the free plan</a> if you don't need our premium features.</li>"
        sk_error_message += "</ul>"
        return sk_error_message
    }
    function getSocialIcon(category) {
        var post_items = ""
        if (category.indexOf("Facebook") != -1) {
            post_items += "<i class='fab fa-facebook' aria-hidden='true'></i>"
        } else if (category.indexOf("Instagram") != -1) {
            post_items += "<i class='fab fa-instagram' aria-hidden='true'></i>"
        } else if (category.indexOf("Linkedin") != -1) {
            post_items += "<i class='fab fa-linkedin' aria-hidden='true'></i>"
        } else if (category.indexOf("Youtube") != -1) {
            post_items += "<i class='fab fa-youtube' aria-hidden='true'></i>"
        } else if (category.indexOf("Google") != -1) {
            post_items += "<i class='fab fa-google' aria-hidden='true'></i>"
        } else if (category.indexOf("Twitter") != -1) {
            post_items += '<i class="fa-brands fa-x-twitter"></i>'
        } else if (category.indexOf("Twitch") != -1) {
            post_items += "<i class='fab fa-twitch' aria-hidden='true'></i>"
        } else if (category.indexOf("Yelp") != -1) {
            post_items += "<i class='fab fa-yelp' aria-hidden='true'></i>"
        } else if (category.indexOf("Vimeo") != -1) {
            post_items += "<i class='fab fa-vimeo' aria-hidden='true'></i>"
        } else if (category.indexOf("Twitch") != -1) {
            post_items += "<i class='fab fa-twitch' aria-hidden='true'></i>"
        } else if (category.indexOf("Trust") != -1) {
            post_items += "<i class='fab fa-trustpilot' aria-hidden='true'></i>"
        } else if (category.indexOf("Spot") != -1) {
            post_items += "<i class='fab fa-spotify' aria-hidden='true'></i>"
        }
        return post_items
    }
    function isFontAwesomeLoaded() {
        var span = document.createElement("span")
        span.className = "fa"
        span.style.display = "none"
        document.body.insertBefore(span, document.body.firstChild)
        var font = css(span, "font-family")
        if (font.indexOf("fontawesome") == -1) {
            return false
        }
        document.body.removeChild(span)
        return true
    }
    function css(element, property) {
        let font = window
            .getComputedStyle(element, null)
            .getPropertyValue(property)
        if (font) {
            font = font.toLowerCase()
            return font.replace(/' '/g, "")
        }
        return "na"
    }
    function main() {
        function loadSettingsData(
            sk_indeed_jobs,
            json_settings_url,
            json_feed_url
        ) {
            fetch(json_feed_url, { method: "get" })
                .then(function (response) {
                    if (!response.ok) {
                        loadSettingsData(
                            sk_indeed_jobs,
                            json_settings_url,
                            json_settings_url
                        )
                        return
                    }
                    response.json().then(function (data) {
                        var settings_data = data
                        original_data = data
                        if (data.settings) {
                            settings_data = data.settings
                            settings_data.type = 58
                        }
                        if (!settings_data.type) {
                            loadSettingsData(
                                sk_indeed_jobs,
                                json_settings_url,
                                json_settings_url
                            )
                            return
                        }
                        settings_data.type = 58
                        var web_safe_fonts = [
                            "Inherit",
                            "Impact, Charcoal, sans-serif",
                            "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
                            "Century Gothic, sans-serif",
                            "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
                            "Verdana, Geneva, sans-serif",
                            "Copperplate, 'Copperplate Gothic Light', fantasy",
                            "'Courier New', Courier, monospace",
                            "Georgia, Serif",
                        ]
                        var is_font_included = web_safe_fonts.indexOf(
                            settings_data.font_family
                        )
                        if (is_font_included < 0) {
                            loadCssFile(
                                "https://fonts.googleapis.com/css?family=" +
                                    settings_data.font_family
                            )
                        }
                        if (data.css) {
                            jQuery("head").append(
                                '<style type="text/css">' +
                                    data.css +
                                    "</style>"
                            )
                        } else {
                            loadCssFile(app_url + "indeed-jobs/widget_css.php")
                        }
                        if (settings_data.show_feed == false) {
                            sk_indeed_jobs.find(".loading-img").hide()
                            sk_indeed_jobs.prepend(settings_data.message)
                        } else {
                            if (settings_data.show_content_space == 1) {
                                var new_sk_indeed_jobs_height =
                                    jQuery(window).height() + 200
                                sk_indeed_jobs.height(new_sk_indeed_jobs_height)
                            } else {
                                var new_sk_indeed_jobs_height =
                                    jQuery(window).height()
                                sk_indeed_jobs.height(new_sk_indeed_jobs_height)
                            }
                            var settings_html = ""
                            settings_html +=
                                "<div class='display-none sk-settings' style='display:none;'>"
                            jQuery.each(settings_data, function (key, value) {
                                settings_html +=
                                    "<div class='" +
                                    key +
                                    "'>" +
                                    value +
                                    "</div>"
                            })
                            settings_html += "</div>"
                            if (sk_indeed_jobs.find(".sk-settings").length) {
                            } else {
                                sk_indeed_jobs.prepend(settings_html)
                            }
                            if (getDsmSetting(sk_indeed_jobs, "layout") == 3) {
                                loadCssFile(
                                    app_url + "libs/swiper/swiper.min.css"
                                )
                                loadCssFile(
                                    app_url +
                                        "libs/swiper/swiper.css?v=ranndomchars"
                                )
                            }
                            settings_html = ""
                            if (data.settings) {
                                loadFeed(sk_indeed_jobs, "")
                            } else {
                                requestFeedData(sk_indeed_jobs)
                            }
                        }
                    })
                })
                .catch(function (err) {
                    loadSettingsData(
                        sk_indeed_jobs,
                        json_settings_url,
                        json_settings_url
                    )
                })
        }
        jQuery(document).ready(function ($) {
            jQuery(".sk-ww-indeed-jobs").each(function () {
                var sk_indeed_jobs = jQuery(this)
                var embed_id = getDsmEmbedId(sk_indeed_jobs)
                var new_sk_indeed_jobs_width = jQuery(window).height() + 100
                sk_indeed_jobs.height(new_sk_indeed_jobs_width)
                var json_settings_url =
                    app_file_server_url.replace("feed", "") +
                    "settings/" +
                    embed_id +
                    "/settings.json?nocache=" +
                    new Date().getTime()
                var json_feed_url =
                    app_file_server_url +
                    embed_id +
                    ".json?nocache=" +
                    new Date().getTime()
                loadSettingsData(
                    sk_indeed_jobs,
                    json_settings_url,
                    json_feed_url
                )
            })
            jQuery(window).resize(function () {
                jQuery(".sk-ww-indeed-jobs").each(function () {
                    var sk_indeed_jobs = jQuery(this)
                    sk_indeed_jobs.css({ width: "100%" })
                    var new_inner_width = sk_indeed_jobs.innerWidth()
                    jQuery(".sk_indeed_jobs_width").text(new_inner_width)
                    applyCustomUi(jQuery, sk_indeed_jobs)
                })
            })
            jQuery(document).on(
                "click",
                ".sk-ww-indeed-jobs .sk_jobs_img,.sk-ww-indeed-jobs .sk_play_button",
                function () {
                    var clicked_element = jQuery(this).closest(
                        ".grid-item-indeed-jobs"
                    )
                    if (
                        clicked_element
                            .closest(".grid-item-indeed-jobs")
                            .find(".more").length > 0
                    )
                        clicked_element
                            .closest(".grid-item-indeed-jobs")
                            .find(".more")[0]
                            .click()
                    var sk_indeed_jobs =
                        clicked_element.closest(".sk-ww-indeed-jobs")
                    var content_src = clicked_element
                        .closest(".grid-item-indeed-jobs")
                        .find(".grid-content")
                        .html()
                    clicked_element
                        .closest(".grid-item-indeed-jobs")
                        .find(".sk-popup-container")
                        .html(content_src)
                    content_src = clicked_element
                        .closest(".grid-item-indeed-jobs")
                        .find(".sk-popup-container")
                    if (getDsmSetting(sk_indeed_jobs, "show_pop_up") == 1) {
                        var jobs_link = clicked_element
                            .closest(".grid-item-indeed-jobs")
                            .find(".href_status_trigger_jobs")
                        if (jobs_link.length > 0) {
                            window.open(jobs_link[jobs_link.length - 1].href)
                        }
                    } else {
                        showPopUp(
                            jQuery,
                            content_src,
                            clicked_element,
                            sk_indeed_jobs
                        )
                        jQuery(".grid-content video").prop("muted", true)
                    }
                }
            )
            jQuery(document).on(
                "click",
                ".sk-ww-indeed-jobs .profile-name, .sk-indeed-logo, .sk-jobs-text, .sk-btn-apply-now",
                function (e) {
                    var clicked_element = jQuery(this)
                    window.open(jQuery(clicked_element).attr("data-link"))
                }
            )
            jQuery(document).on(
                "click",
                ".sk-ww-indeed-jobs .jobs-content",
                function (e) {
                    var clicked_element = jQuery(this).closest(
                        ".grid-item-indeed-jobs"
                    )
                    var sk_indeed_jobs =
                        clicked_element.closest(".sk-ww-indeed-jobs")
                    if (getDsmSetting(sk_indeed_jobs, "show_pop_up") == 1) {
                        var content_src = clicked_element.find(
                            ".sk-popup-container"
                        )
                        showPopUp(
                            jQuery,
                            content_src,
                            clicked_element,
                            sk_indeed_jobs
                        )
                    }
                }
            )
            jQuery(document).on("click", ".next_sk_google_review", function () {
                var clicked_element = jQuery(this)
                clicked_element.html(
                    "<i class='fa fa-spinner fa-pulse' aria-hidden='true'></i>"
                )
                var new_clicked_element = jQuery(".sk_selected_reviews").next(
                    ".grid-item-indeed-jobs"
                )
                var content_src = new_clicked_element.find(
                    ".sk-popup-container"
                )
                showPopUp(jQuery, content_src, new_clicked_element)
            })
            jQuery(document).on("click", ".prev_sk_google_review", function () {
                var clicked_element = jQuery(this)
                clicked_element.html(
                    "<i class='fa fa-spinner fa-pulse' aria-hidden='true'></i>"
                )
                var new_clicked_element = jQuery(".sk_selected_reviews").prev(
                    ".grid-item-indeed-jobs"
                )
                var content_src = new_clicked_element.find(
                    ".sk-popup-container"
                )
                showPopUp(jQuery, content_src, new_clicked_element)
            })
            jQuery(document).on(
                "click",
                ".sk-ww-indeed-jobs .sk-indeed-jobs-load-more-jobs",
                function () {
                    if (jQuery(this).attr("disabled") == "disabled") {
                        return false
                    }
                    jQuery(this).attr("disabled", "disabled")
                    var current_btn = jQuery(this)
                    var current_btn_text = current_btn.text()
                    var sk_indeed_jobs =
                        jQuery(this).closest(".sk-ww-indeed-jobs")
                    var embed_id = getDsmEmbedId(sk_indeed_jobs)
                    var next_page = sk_indeed_jobs
                        .find(".sk-indeed-jobs-next-page")
                        .text()
                    var jobs_items = ""
                    var enable_button = false
                    var old_last_key = last_key
                    last_key =
                        old_last_key +
                        parseInt(getDsmSetting(sk_indeed_jobs, "post_count"))
                    for (var i = old_last_key; i < last_key; i++) {
                        if (typeof data_storage[i] != "undefined") {
                            jobs_items += getFeedItem(
                                data_storage[i],
                                sk_indeed_jobs,
                                original_data.bio
                            )
                        }
                    }
                    if (data_storage.length > last_key) {
                        enable_button = true
                    }
                    var $items = jQuery(jobs_items)
                    current_btn.hide()
                    if (enable_button == true) {
                        current_btn.show()
                    }
                    sk_indeed_jobs.find(".grid-indeed-jobs").append(jobs_items)
                    current_btn.removeAttr("disabled")
                    applyCustomUi(jQuery, sk_indeed_jobs)
                    fixMasonry()
                }
            )
            jQuery(document).on(
                "submit",
                ".sk-ww-indeed-jobs .sk_ww_search_facebook_videos_form",
                function (e) {
                    e.preventDefault()
                    var sk_indeed_jobs =
                        jQuery(this).closest(".sk-ww-indeed-jobs")
                    var search_term = jQuery(this)
                        .find(".sk_ww_search_facebook_feed_keyword")
                        .val()
                    sk_indeed_jobs.find(".loading-img").show()
                    sk_indeed_jobs.find(".sk-solution-holder").hide()
                    loadFeed(sk_indeed_jobs, search_term)
                    return false
                }
            )
            jQuery(document).on(
                "input",
                "input.sk_ww_search_facebook_feed_keyword",
                function () {
                    var search_term = jQuery(this).val()
                    var sk_indeed_jobs =
                        jQuery(this).closest(".sk-ww-indeed-jobs")
                    if (search_term) {
                        jQuery(this)
                            .closest("div")
                            .find(".sk_ww_search_icon")
                            .removeClass("fa-search")
                        jQuery(this)
                            .closest("div")
                            .find(".sk_ww_search_icon")
                            .addClass("fa-times")
                    } else {
                        jQuery(this)
                            .closest("div")
                            .find(".sk_ww_search_icon")
                            .addClass("fa-search")
                        jQuery(this)
                            .closest("div")
                            .find(".sk_ww_search_icon")
                            .removeClass("fa-times")
                    }
                }
            )
            jQuery(document).on(
                "click touchstart",
                "i.sk_ww_search_icon.fa-times",
                function () {
                    jQuery(this)
                        .closest("form")
                        .find(".sk_ww_search_facebook_feed_keyword")
                        .val("")
                    var sk_indeed_jobs =
                        jQuery(this).closest(".sk-ww-indeed-jobs")
                    loadFeed(sk_indeed_jobs, "")
                    return false
                }
            )
        })
    }
})(window, document)
