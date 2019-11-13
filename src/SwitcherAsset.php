<?php
namespace kilyakus\switcher;

class SwitcherAsset extends \yii\web\AssetBundle
{
    public function init()
    {
        $this->sourcePath = __DIR__ . '/assets';

        $this->js[] = 'js/switcher.js';
        $this->css[] = 'css/switcher.css';

        parent::init();
    }

    public $jsOptions = [
        'position' => \yii\web\View::POS_END
    ];
}
