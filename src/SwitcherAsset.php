<?php
namespace kilyakus\switcher;

class SwitcherAsset extends \yii\web\AssetBundle
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
        'yii\web\YiiAsset',
    ];
    public $jsOptions = array(
        'position' => \yii\web\View::POS_HEAD
    );
}
