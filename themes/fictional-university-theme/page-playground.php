<?php
get_header();

while (have_posts()) {
    the_post();
    pageBanner();
?>

    <div class="second-banner " style="background-image:url(<?php echo get_field('image')['sizes']['pageBanner'] ?>)">
        <div class="col-1">
            <span><?php echo get_field('title_one') ?></span>
        </div>
        <div class="col-2">
            <span><?php echo get_field('title_two') ?></span>
        </div>
    </div>

    <form class="playground-form">
        <span class="form-title">Please fill in your details here</span>
        <div class="form-control">
            <label for="form-name">Name</label>
            <input id="form-name" type="text">
        </div>
        <div class="form-control">
            <label for="form-name">Email</label>
            <input id="form-name" type="text">
        </div>
        <button type='submit' class="submit-btn">Submit</button>
    </form>

    <div class="generic-content">
        <?php the_content(); ?>
    </div>

    </div>


<?php }


get_footer();

?>