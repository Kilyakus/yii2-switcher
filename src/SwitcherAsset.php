<?php
namespace kilyakus\scrollbar;

class PerfectScrollbarAsset extends \yii\web\AssetBundle
{
    public function init()
    {
        $this->sourcePath = __DIR__ . '/assets';
    }
    public $css = [
        'css/switcher.css',
    ];
    public $js = [
        'js/switcher.js',
    ];
    public $depends = [
    ];
    public $jsOptions = array(
        'position' => \yii\web\View::POS_HEAD
    );
}
