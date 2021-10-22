<template>
    <!-- 时间线组件 -->
    <div class="timeline">
        <div class="entry">
            <div class="title">
                <slot :item="workItem">
                    <h3>{{workItem.title}}</h3>
                </slot>
                <p>{{workItem.subTitle}}</p>
            </div>
            <div class="body">
                <p>{{workItem.content}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "timeLine",
        props: {
            workItem: Object
        }
    }
</script>

<style lang="scss" scoped>
    $gutter: 30px;
    $border-width: 4px;
    $dot-diameter: 8px;

    .timeline {
        width: 100%;
        max-width: 1100px;
        background: #fff;
        padding: 50px;
        position: relative;
        &:before {
            content: '';
            position: absolute;
            top: 0px;
            left: calc(33% + 15px); //$gutter/2
            bottom: 0px;
            width: $border-width;
            background: #ddd;
        }
        &:after {
            content: "";
            display: table;
            clear: both;
        }
    }

    .entry {
        clear: both;
        text-align: left;
        position: relative;
        .title {
            margin-bottom: .5em;
            float: left;
            width: 33%;
            padding-right: $gutter;
            text-align: right;
            position: relative;
            &:before {
                content: '';
                position: absolute;
                width: $dot-diameter;
                height: $dot-diameter;
                border: $border-width solid salmon;
                background-color: #fff;
                border-radius: 100%;
                top: 15%;
                right: -$dot-diameter;
                z-index: 99;
            }
            h3 {
                margin: 0;
                font-size: 120%;
            }
            p {
                margin: 0;
                font-size: 100%;
            }
        }
        .body {
            margin: 0 0 3em;
            float: right;
            width: 66%;
            padding-left: $gutter;
            p {
                line-height: 1.4em;
                &:first-child {
                    margin-top: 0;
                    font-weight: 400;
                }
            }
            ul {
                color: #aaa;
                padding-left: 0;
                list-style-type: none;
                li:before {
                    content: "-";
                    margin-right: .5em;
                }
            }
        }
    }

</style>
