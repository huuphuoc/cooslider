<?php
/**
 * Generates and caches thumbnail. It is packed with CooSlider
 *
 * @author Nguyen Huu Phuoc <thenextcms@gmail.com>
 */

// The URL that will be added at the top of generated thumbnail's URL
define('C_PREFIX_URL', 'http://slider.phuoc.local/cache');

// The directory stores the thumbnails. It has to be writable.
// Some good examples are:
// define('C_THUMB_DIR', '/rootFolder/cache');
// define('C_THUMB_DIR', __DIR__ . '/thumb');
define('C_THUMB_DIR',  '/Volumes/Data/projects/slider/src/cache');

// --- DO NOT CHANGE ANYTHING BELOW ---
// Get the image, width and height from requests
if (!isset($_GET['url']) || !isset($_GET['w'])) {
    die('Error: parameters are not found');
}

$url       = urldecode($_GET['url']);
$newWidth  = $_GET['w'];

$generator = null;
switch (true) {
    case (extension_loaded('imagick')):
        $generator = new C_Imagick();
        break;
    case (extension_loaded('gd')):
        $generator = new C_Gd();
        break;
    default:
        // ERROR: Cannot found PHP extensions for generating thumbnails
        echo $url;
        exit();
        break;
}

// Normalize the URL
if ('http://' != substr($url, 0, 7) || 'https://' != substr(url, 0, 8)) {
    // Prepend the domain name to URL
    $url = ((isset($_SERVER['SERVER_PROTOCOL']) && 'https' == substr(strtolower($_SERVER['SERVER_PROTOCOL']), 0, 5)) ? 'https://' : 'http://')
         . $_SERVER['SERVER_NAME']
         . (($_SERVER['SERVER_PORT'] == 80) ? '' : (':' . $_SERVER['SERVER_PORT']))
         . '/' . ltrim($url, '/');
}

$pathInfo  = pathinfo($url);
$file      = md5($url) . '_' . $newWidth . '.' . $pathInfo['extension'];
$thumbnail = C_THUMB_DIR . '/' . $file;

// Check if it is already generated
if (file_exists($thumbnail)) {
    echo C_PREFIX_URL . '/' . $file;
    exit();
}

// Generate the thumbnails
$generator->setSourceImage($url)->setDestinationImage($thumbnail);
if ($newWidth > $generator->getWidth()) {
    echo $url;
} else {
    $newHeight = (int) $newWidth * $generator->getHeight() / $generator->getWidth();
    $generator->crop($newWidth, $newHeight);
    echo C_PREFIX_URL . '/' . $file;
}
exit();

// --- Thumbnail generator classes ---

abstract class C_ThumbGenerator
{
    /**
     * The source image
     * @var string
     */
    protected $_sourceImage;

    /**
     * Type of source image: gif, jpg, jpeg, png
     * @var string
     */
    protected $_sourceImageType;

    /**
     * Width of image
     * @var int
     */
    protected $_width;

    /**
     * Height of image
     * @var int
     */
    protected $_height;

    /**
     * Destination image
     * @var string
     */
    protected $_destinationImage;

    /**
     * Sets the source image
     *
     * @param string $file Path of the source image
     * @return C_ThumbGenerator
     */
    public function setSourceImage($file)
    {
        $this->_sourceImage = $file;

        // Get size of image
        $size = getimagesize($this->_sourceImage);

        $this->_width  = $size[0];
        $this->_height = $size[1];
        $extension	   = explode('.', $file);
        $this->_sourceImageType = strtolower($extension[count($extension) - 1]);

        return $this;
    }

    /**
     * Sets the destination image
     *
     * @param string $file Path of the destination image
     * @return C_ThumbGenerator
     */
    public function setDestinationImage($file)
    {
        $this->_destinationImage = $file;
        return $this;
    }

    /**
     * Gets width of the source image
     *
     * @return int
     */
    public function getWidth()
    {
        return $this->_width;
    }

    /**
     * Gets height of source image
     *
     * @return int
     */
    public function getHeight()
    {
        return $this->_height;
    }

    public function fit($w, $h)
    {
        $percent = ($this->_width > $w) ? (($w * 100) / $this->_width) : 100;
        $w		 = ($this->_width * $percent) / 100;
        $h		 = ($this->_height * $percent) / 100;
        $this->_resize($w, $h);
    }

    public function crop($w, $h, $cropX = null, $cropY = null, $resize = true)
    {
        // Maintain ratio if image is smaller than resize
        $percent		  = ($this->_width > $w) ? ($w * 100) / ($this->_width) : 100;

        // Resize to one side to newWidth or newHeight
        $percentWidght	  = ($w * 100) / $this->_width;
        $percentHeight	  = ($h * 100) / $this->_height;

        if ($percentWidght > $percentHeight) {
            $resizeWidth  = $w;
            $resizeHeight = ($this->_height * $percentWidght) / 100;
        } else {
            $resizeHeight = $h;
            $resizeWidth  = ($this->_width * $percentHeight) / 100;
        }

        $cropX = (null == $cropX) ? ($resizeWidth - $w) / 2 : $cropX;
        $cropY = (null == $cropY) ? ($resizeHeight - $h) / 2 : $cropY;

        $this->_crop($resizeWidth, $resizeHeight, $w, $h, $cropX, $cropY, $resize);
    }

    abstract protected function _resize($w, $h);

    abstract protected function _crop($resizeWidth, $resizeHeight, $w, $h, $cropX, $cropY, $resize = true);
}

class C_Gd extends C_ThumbGenerator
{
    protected function _resize($w, $h)
    {
        $source	 	 = $this->_createSourceFile($this->_sourceImage);
        $destination = imagecreatetruecolor($w, $h);
        imagecopyresampled($destination, $source, 0, 0, 0, 0, $w, $h, $this->_width, $this->_height);

        $this->_createDestinationFile($destination, $this->_destinationImage);

        imagedestroy($source);
        imagedestroy($destination);
    }

    protected function _crop($resizeWidth, $resizeHeight, $w, $h, $cropX, $cropY, $resize = true)
    {
        if ($resize) {
            // Resize
            $this->_resize($resizeWidth, $resizeHeight);
            $source = $this->_createSourceFile($this->_destinationImage);
        } else {
            // Crop
            $source = $this->_createSourceFile($this->_sourceImage);
        }

        $destination = imagecreatetruecolor($w, $h);

//		imagecopyresized($destination, $source, 0, 0, $cropX, $cropY, $w, $h, $resizeWidth, $resizeHeight);
        imagecopy($destination, $source, 0, 0, $cropX, $cropY, $w, $h);

        $this->_createDestinationFile($destination, $this->_destinationImage);

        imagedestroy($source);
        imagedestroy($destination);
    }

    private function _createSourceFile($source)
    {
        $extension = explode('.', $source);
        $type	   = strtolower($extension[count($extension) - 1]);
        switch ($type) {
            case 'jpg':
            case 'jpeg':
                return imagecreatefromjpeg($source);
                break;
            case 'png':
                return imagecreatefrompng($source);
                break;
            case 'gif':
                return imagecreatefromgif($source);
                break;
            case 'wbmp':
                return imagecreatefromwbmp($source);
                break;
            default:
                //throw new Exception('Do not support ' . $type . ' type of image');
                break;
        }
        return null;
    }

    private function _createDestinationFile($source, $destination, $quality = 100)
    {
        switch($this->_sourceImageType) {
            case 'jpg':
            case 'jpeg':
                imagejpeg($source, $destination, $quality);
                break;
            case 'png':
                $quality = ($quality > 9) ? 9 : $quality;
                imagepng($source, $destination, $quality);
                break;
            case 'gif':
                imagegif($source, $destination);
                break;
            case 'wbmp':
                imagewbmp($source, $destination);
                break;
            default:
                //throw new Exception('Do not support ' . $this->_sourceImageType . ' type of image');
                break;
        }
        return null;
    }
}

class C_Imagick extends C_ThumbGenerator
{
    protected function _resize($w, $h)
    {
        $imagick = new Imagick();
        $imagick->readImage($this->_sourceImage);

        $imagick->resizeImage($w, $h, Imagick::FILTER_LANCZOS, 1);
        $imagick->writeImage($this->_destinationImage);

        $imagick->clear();
        $imagick->destroy();
    }

    protected function _crop($resizeWidth, $resizeHeight, $w, $h, $cropX, $cropY, $resize = true)
    {
        $imagick = new Imagick();
        $imagick->readImage($this->_sourceImage);

        if ($resize) {
            // Resize first
            $imagick->resizeImage($resizeWidth, $resizeHeight, Imagick::FILTER_LANCZOS, 1);
        }

        // Crop
        $imagick->cropImage($w, $h, $cropX, $cropY);
        $imagick->writeImage($this->_destinationImage);

        $imagick->clear();
        $imagick->destroy();
    }
}