<?php

	header("content-type: text/xml");

	$data = $HTTP_RAW_POST_DATA;

	$ptr = fopen("exports/object.stl", "wb");
	fwrite($ptr, $data);
	fclose($ptr);

	echo "ok";

	return;
?>

