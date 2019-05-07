$( document ).ready(function() {
  var items = [];
  var itemsRaw = [];

  $.getJSON('/api/books', function(data) {
    try {
    //var items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
    }
    catch (e) {console.error(e)}
    return false;
  });

  var comments = [];
  $('#display').on('click','li.bookItem',function(e) {
    e.preventDefault;
    var commensForThis = itemsRaw.filter(item => {
      return item._id == itemsRaw[this.id];
    });
    var commentPars = '';
    commensForThis.forEach(function(comment) {
      commentPars += '<p>'+comment+'</p>';
    })
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id +')<b>'+commentPars);
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      console.log("'click','li.bookItem',function(e) {");
      console.log(itemsRaw)
      console.log(this)
      console.log(data)
      comments = [];
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
      comments.push('<br><button class="btn btn-info addComment" id="'+ data.id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data.id+'">Delete Book</button>');
      $('#detailComments').html(comments.join(''));
    });
    return false;
  });
  $("#comment-on-book").click(function() {
    $.ajax({
      url: 'api/books/'+$('#idinputtest').val(),
      type: 'post',
      dataType: 'json',
      data: $('#commentTest').serialize(),
      success: function(data) {
        $('#detailComments')
        .append('<li>'+data.title+' '+' comments: '+data.comments.length+'</li>')
      }
    });
    return false;
  });
  $('#bookDetail').on('click','button.deleteBook',function() {
    console.log("$('#bookDetail').on('click','button.deleteBook',function() {")
    console.log(this.id)
    $.ajax({
      url: '/api/books/'+this.id, //CHECK ID UNDEFINED!!!!!!!!!!!!!!!!
      type: 'delete',
      success: function(data) {
        console.log("success: deletebook")
        console.log(data)
        //update list
        $('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
      }
    });
    return false;
  });

  $('#bookDetail').on('click','button.addComment',function() {
    var newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        comments.unshift(newComment); //adds new comment to top of list
        $('#detailComments').html(comments.join(''));
      }
    });
    return false;
  });

  $('#btnsubmit-book').on('click', function() {
    try {
      var data;
      $.ajax({
        type: 'POST',
        url: '/api/books',
        dataType: 'json',
        data: $('#frmsubmitbook').serialize(),
        success: function(data) {
          $('#detailComments').append('<li>'+data.title+'</li>')
        }
      });
  } catch(e) {
    console.error(e)
  }
  return false;
  });
  $("#btnsubmit-new-book").on('click', function() {
    try {
      $.ajax({
        type: 'POST',
        url: '/api/books',
        dataType: 'json',
        data: $('#frmNewBook').serialize(),
        success: function(data) {
          console.log(data)
          $("#detailComments").append('<li>'+data.title+'</li>')
        },
        error: function(e) {
          console.error(e);
        }
      });
    } catch (e) {
      console.error(e);
    }
    return false;
  });
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
    return false;
  });

});
